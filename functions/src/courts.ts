import {onCall} from "firebase-functions/v2/https";
import {getFirestore} from "firebase-admin/firestore";
import {checkPermissions} from "./utils/auth";
import {functionSettings} from "./config";
import {onDocumentUpdated} from "firebase-functions/firestore";
import {log} from "firebase-functions/logger";

export const createCourt = onCall(functionSettings, async (request) => {
  await checkPermissions(request, ["sudo"]);

  const {name} = request.data;

  const court = await getFirestore().collection("courts").add({
    name,
  });
  return {id: court.id};
});

export const updateCourt = onCall(functionSettings, async (request) => {
  await checkPermissions(request, ["sudo"]);

  const {id, ...data} = request.data;

  await getFirestore().collection("courts").doc(id).update(data);

  return {id};
});

export const deleteCourt = onCall(functionSettings, async (request) => {
  await checkPermissions(request, ["sudo"]);

  const {id} = request.data;
  await getFirestore().collection("courts").doc(id).delete();

  return {id};
});

export const updateCourtName = onDocumentUpdated("/courts/{courtId}", async (event) => {
  log("Updating court name", event.params.courtId);
  try {
    const courtRef = getFirestore().collection("courts").doc(event.params.courtId);
    const schedules = await getFirestore().collection("schedules").where("court", "==", courtRef).get();
    console.log("Schedules", schedules.docs.length);
    await Promise.all(
      schedules.docs.map(async (schedule) => {
        console.log("Updating schedule", schedule.id);
        console.log(event.data?.after.data());
        await schedule.ref.update({
          courtName: event.data?.after.data()?.name,
        });
      })
    );
  } catch (error) {
    log("Error updating court name", event.params.courtId, error);
  }
});
