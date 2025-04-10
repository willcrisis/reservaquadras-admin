import {HttpsError, onCall} from "firebase-functions/https";
import {checkPermissions} from "./utils/auth";
import {DocumentData, DocumentReference, FieldPath, getFirestore, QuerySnapshot} from "firebase-admin/firestore";
import {buildRange, checkClash} from "./utils/schedule";
import {documentExists} from "./utils/document";
import {functionSettings} from "./config";
import {endOfDay, startOfDay} from "date-fns";

type CreateScheduleInput = {
  startDate: Date;
  endDate: Date;
  courts: string[];
  type: "ranking" | "casual";
};

export const createSchedule = onCall<CreateScheduleInput>(functionSettings, async (request) => {
  const userRef = await checkPermissions(request, ["sudo", "admin"]);

  let {startDate, endDate} = request.data;
  const {courts, type} = request.data;

  startDate = new Date(startDate);
  endDate = new Date(endDate);

  const collection = getFirestore().collection("schedules");

  const schedules = await Promise.all(
    courts.map(async (court: string) => {
      const courtRef = getFirestore().collection("courts").doc(court);
      const courtData = await documentExists(courtRef);

      await checkClash(collection, startDate, endDate, courtRef);

      await collection.add({
        startDate,
        endDate,
        startDateTime: startDate.getTime(),
        endDateTime: endDate.getTime(),
        court: courtRef,
        courtName: courtData.name,
        type,
        users: [],
        createdBy: userRef,
        createdAt: new Date(),
        publishedAt: null,
      });
    }),
  );

  return {success: schedules.length};
});

type CreateAllDayScheduleInput = CreateScheduleInput & { interval: number };

export const createAllDaySchedule = onCall<CreateAllDayScheduleInput>(functionSettings, async (request) => {
  const userRef = await checkPermissions(request, ["sudo", "admin"]);

  let {startDate, endDate} = request.data;
  const {courts, type, interval} = request.data;
  startDate = new Date(startDate);
  endDate = new Date(endDate);

  const collection = getFirestore().collection("schedules");

  const range = buildRange(startDate, endDate, interval);

  const schedules = await Promise.all(
    courts.map(async (court: string) => {
      const courtRef = getFirestore().collection("courts").doc(court);

      await documentExists(courtRef);
      const courtData = await documentExists(courtRef);

      await checkClash(collection, startDate, endDate, courtRef);

      await Promise.all(
        range.map(async (range) => {
          await collection.add({
            startDate: range.start,
            endDate: range.end,
            startDateTime: range.start.getTime(),
            endDateTime: range.end.getTime(),
            type,
            users: [],
            court: courtRef,
            courtName: courtData.name,
            createdBy: userRef,
            createdAt: new Date(),
            publishedAt: null,
          });
        }),
      );
    }),
  );

  return {success: schedules.length};
});

export const updateSchedule = onCall(functionSettings, async (request) => {
  const userRef = await checkPermissions(request, ["sudo", "admin"]);

  let {startDate, endDate} = request.data;
  const {id, type, users} = request.data;
  startDate = new Date(startDate);
  endDate = new Date(endDate);

  const collection = getFirestore().collection("schedules");

  const scheduleRef = collection.doc(id);
  const schedule = await documentExists(scheduleRef);

  await checkClash(collection, startDate, endDate, schedule.court, id);

  let usersDoc: QuerySnapshot<DocumentData> | null = null;
  let publishedAt = schedule.publishedAt;

  if (users?.length) {
    if (schedule.type === "ranking" && users.length !== 2) {
      throw new HttpsError("invalid-argument", "Ranking deve ter 2 jogadores");
    }
    if (schedule.type === "casual" && users.length !== 1) {
      throw new HttpsError("invalid-argument", "Bate-bola deve ter 1 jogador");
    }

    const usersRef = getFirestore().collection("users").where(FieldPath.documentId(), "in", users);

    usersDoc = await usersRef.get();
    if (usersDoc.size !== users.length) {
      throw new HttpsError("not-found", "Alguns usuários não foram encontrados");
    }

    publishedAt = new Date();
  } else if (schedule.users?.length) {
    usersDoc = {docs: []} as unknown as QuerySnapshot<DocumentData>;
    publishedAt = null;
  }

  await scheduleRef.update({
    startDate,
    endDate,
    type,
    publishedAt,
    users: usersDoc ? usersDoc.docs.map((doc) => doc.ref) : [],
    updatedBy: userRef,
    updatedAt: new Date(),
  });

  return {id};
});

export const deleteSchedule = onCall(functionSettings, async (request) => {
  await checkPermissions(request, ["sudo", "admin"]);

  const {id} = request.data;

  const collection = getFirestore().collection("schedules");

  const scheduleRef = collection.doc(id);
  await documentExists(scheduleRef);

  await scheduleRef.delete();

  return {id};
});

export const publishSchedule = onCall(functionSettings, async (request) => {
  await checkPermissions(request, ["sudo", "admin"]);

  const {id} = request.data;

  const collection = getFirestore().collection("schedules");

  const scheduleRef = collection.doc(id);
  const schedule = await documentExists(scheduleRef);

  if (schedule.publishedAt) {
    throw new HttpsError("already-exists", "Agendamento já publicado");
  }

  if (!schedule.users?.length) {
    // TODO: notify users
  }

  await scheduleRef.update({
    publishedAt: new Date(),
  });

  return {id};
});

export const publishAll = onCall(functionSettings, async (request) => {
  await checkPermissions(request, ["sudo", "admin"]);

  let {startDate, endDate} = request.data;
  startDate = new Date(startDate);
  endDate = new Date(endDate);

  const collection = getFirestore().collection("schedules");

  const schedules = await collection
    .where("startDateTime", ">=", startDate.getTime())
    .where("endDateTime", "<=", endDate.getTime())
    .where("publishedAt", "==", null)
    .get();

  await Promise.all(
    schedules.docs.map(async (schedule) => {
      await schedule.ref.update({
        publishedAt: new Date(),
      });
    }),
  );

  // TODO: notify users

  return {success: schedules.size};
});

export const registerViewer = onCall(functionSettings, async (request) => {
  const userRef = await checkPermissions(request, ["player", "ranking"]);

  const {scheduleId} = request.data;

  const scheduleRef = getFirestore().collection("schedules").doc(scheduleId);
  const schedule = await documentExists(scheduleRef);

  await scheduleRef.update({
    viewers: [...(schedule.viewers || []), userRef],
  });

  return {id: scheduleId};
});

export const unregisterViewer = onCall(functionSettings, async (request) => {
  const userRef = await checkPermissions(request, ["player", "ranking"]);

  const {scheduleId} = request.data;

  const scheduleRef = getFirestore().collection("schedules").doc(scheduleId);
  const schedule = await documentExists(scheduleRef);

  await scheduleRef.update({
    viewers: schedule.viewers?.filter((viewer: DocumentReference) => viewer.id !== userRef.id),
  });

  return {id: scheduleId};
});

export const takeSchedule = onCall(functionSettings, async (request) => {
  const {scheduleId, rivalId} = request.data;
  const scheduleRef = getFirestore().collection("schedules").doc(scheduleId);
  const schedule = await documentExists(scheduleRef);

  const role = schedule.type === "casual" ? "player" : "ranking";
  const userRef = await checkPermissions(request, [role]);

  if (schedule.users?.length) {
    throw new HttpsError("already-exists", "Agendamento já reservado");
  }

  if (schedule.type === "ranking" && !rivalId) {
    throw new HttpsError("invalid-argument", "Ranking deve ter um oponente");
  }

  const startDate = startOfDay(schedule.startDate.toDate());

  const schedules = await getFirestore()
    .collection("schedules")
    .where("startDateTime", ">=", startDate.getTime())
    .where("startDateTime", "<=", endOfDay(startDate).getTime())
    .where("users", "array-contains", userRef)
    .get();

  if (schedules.size > 0) {
    throw new HttpsError("already-exists", "Você já possui uma reserva nesse dia");
  }

  const users = [userRef];

  if (rivalId) {
    const rivalRef = getFirestore().collection("users").doc(rivalId);
    await documentExists(rivalRef);
    users.push(rivalRef);
  }

  await scheduleRef.update({
    users,
    updatedBy: userRef,
    updatedAt: new Date(),
  });

  return {id: scheduleId};
});

export const releaseSchedule = onCall(functionSettings, async (request) => {
  const userRef = await checkPermissions(request, ["player", "ranking"]);

  const {scheduleId} = request.data;

  const scheduleRef = getFirestore().collection("schedules").doc(scheduleId);
  const schedule = await documentExists(scheduleRef);

  if (!schedule.users?.length) {
    throw new HttpsError("already-exists", "Agendamento não reservado");
  }

  await scheduleRef.update({
    users: [],
    updatedBy: userRef,
    updatedAt: new Date(),
  });

  return {id: scheduleId};
});
