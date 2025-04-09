import {onCall} from "firebase-functions/v2/https";
import {getAuth} from "firebase-admin/auth";
import {onDocumentDeleted} from "firebase-functions/firestore";
import {getFirestore} from "firebase-admin/firestore";
import {log} from "firebase-functions/logger";
import {checkPermissions} from "./utils/auth";
import {functionSettings} from "./config";
import {fakerPT_BR as faker} from "@faker-js/faker";


export const createUser = onCall(functionSettings, async (request) => {
  await checkPermissions(request, ["sudo"]);

  const {name, phoneNumber, email, roles, countryCode} = request.data;
  const newUser = await getAuth().createUser({
    displayName: name,
    ...(phoneNumber && countryCode ? {phoneNumber: `+${countryCode}${phoneNumber}`} : {}),
    ...(email ? {email} : {}),
  });

  await getFirestore().collection("users").doc(newUser.uid).set({
    name,
    email,
    phoneNumber,
    roles,
    countryCode,
  });
  return {id: newUser.uid};
});

export const updateUser = onCall(functionSettings, async (request) => {
  await checkPermissions(request, ["sudo"]);

  const {id, ...data} = request.data;
  const {name, phoneNumber, email, countryCode} = data;

  await getAuth().updateUser(id, {
    displayName: name,
    ...(phoneNumber && countryCode ? {phoneNumber: `+${countryCode}${phoneNumber}`} : {}),
    ...(email ? {email} : {}),
  });

  await getFirestore().collection("users").doc(id).update(data);

  return {id};
});

export const deleteUser = onCall(functionSettings, async (request) => {
  await checkPermissions(request, ["sudo"]);

  const {id} = request.data;
  await getFirestore().collection("users").doc(id).delete();

  return {id};
});

export const cleanupDeletedUser = onDocumentDeleted("/users/{userId}", async (event) => {
  log("Deleting user", event.params.userId);
  try {
    await getAuth().deleteUser(event.params.userId);
  } catch (error) {
    log("Error deleting user", event.params.userId, error);
  }
});

const flipCoin = () => Math.random() < 0.5;

export const createTestUsers = onCall(functionSettings, async (request) => {
  await checkPermissions(request, ["sudo"]);

  const {count} = request.data;

  for (let i = 0; i < count; i++) {
    const roles = flipCoin() ? ["player"] : [];

    if (roles.length === 0 || flipCoin()) {
      roles.push("ranking");
    }

    const userName = faker.person.fullName();
    const photoURL = `https://i.pravatar.cc/300?u=${encodeURIComponent(userName)}`;

    const userData = {
      name: userName,
      phoneNumber: faker.string.numeric(9),
      roles,
      countryCode: "55",
      photoURL,
    };
    const newUser = await getAuth().createUser({
      displayName: userData.name,
      phoneNumber: `+${userData.countryCode}${userData.phoneNumber}`,
      photoURL,
    });

    await getFirestore().collection("users").doc(newUser.uid).set(userData);
  }

  return {success: 100};
});
