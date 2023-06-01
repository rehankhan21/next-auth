import connectToDatabase from "@/lib/db";
import { getSession } from "next-auth/client";
import { hashPassword, verifyPassword } from "@/lib/auth";

async function handler(req, res) {
  if (req.method !== "PATCH") {
    return;
  }

  const session = await getSession({ req: req });

  if (!session) {
    res.status(401).json({ message: "Not Authenticated!" });
    return;
  }

  const userEmail = session.user.email;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;
  console.log(newPassword);
  console.log(oldPassword);

  const client = await connectToDatabase();

  const usersCollection = client.db().collection("users");

  const user = usersCollection.findOne({
    email: userEmail,
  });

  if (!user) {
    res.status(404).json({ message: "user not found" });
    client.close();
    return;
  }

  const currentPassword = user.password;

  const passwordsAreEqual = await verifyPassword(oldPassword, currentPassword);

  if (!passwordsAreEqual) {
    res.status(403).json({ message: "Invalid password" });
    client.close();
    return;
  }

  const hashedPassword = hashPassword(newPassword);

  const result = await usersCollection.updateOne(
    { email: userEmail },
    { $set: { password: hashedPassword } }
  );

  client.close();
  res.status(200).json({ message: "Password was changed!" });
}

export default handler;
