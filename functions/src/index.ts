import {initializeApp} from "firebase-admin/app";
import {getFirestore} from "firebase-admin/firestore";

initializeApp();
getFirestore().settings({
  ignoreUndefinedProperties: true,
});

export * from "./users";
export * from "./courts";
export * from "./schedules";
export * from "./reminders";
