import { currentUser } from "@clerk/nextjs/server";
import { db } from "./db";

export const checkUser = async () => {
    const user = await currentUser();
    if (!user) {
        return null
    }

    let loggedInUser = await db.user.findUnique({
        where: { clerkUserId: user.id},
        include: {
            classes: true
        }
    })

    if(!loggedInUser) {
        loggedInUser = await db.user.create({
            data: {
                clerkUserId: user.id,
                name: `${user.firstName} ${user.lastName}`,
                email: user.emailAddresses[0].emailAddress,
            }
        })
    }

    return loggedInUser;
}