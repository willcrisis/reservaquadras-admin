import {onCall} from "firebase-functions/https";
import {functionSettings} from "./config";
import {checkPermissions} from "./utils/auth";
import {documentExists} from "./utils/document";
import {getFirestore} from "firebase-admin/firestore";

export const createReminder = onCall(functionSettings, async (request) => {
  const user = await checkPermissions(request, ["player", "ranking"]);

  const {scheduleId} = request.data;

  const scheduleRef = getFirestore().collection("schedules").doc(scheduleId);
  await documentExists(scheduleRef);

  const reminder = await getFirestore().collection("reminders").add({
    schedule: scheduleRef,
    user,
  });

  return {id: reminder.id};
});

export const deleteReminder = onCall(functionSettings, async (request) => {
  await checkPermissions(request, ["player", "ranking"]);

  const {reminderId} = request.data;

  const reminderRef = getFirestore().collection("reminders").doc(reminderId);
  await documentExists(reminderRef);

  await reminderRef.delete();

  return {id: reminderId};
});
