import {onCall} from "firebase-functions/v2/https";
import {getFirestore} from "firebase-admin/firestore";
import {checkPermissions} from "./utils/auth";

export const createCourt = onCall(async (request) => {
  await checkPermissions(request, ["sudo"]);

  const {name} = request.data;

  const court = await getFirestore().collection("courts").add({
    name,
  });
  return {id: court.id};
});

export const updateCourt = onCall(async (request) => {
  await checkPermissions(request, ["sudo"]);

  const {id, ...data} = request.data;

  await getFirestore().collection("courts").doc(id).update(data);

  return {id};
});

export const deleteCourt = onCall(async (request) => {
  await checkPermissions(request, ["sudo"]);

  const {id} = request.data;
  await getFirestore().collection("courts").doc(id).delete();

  return {id};
});
