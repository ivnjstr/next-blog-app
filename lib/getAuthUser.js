import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { connectDB } from "@/lib/config/db";
import UserModel from "@/lib/models/UserModel";

// NextAuth's JWT only refreshes `role` at login, so a role change made by an
// admin wouldn't take effect for an already-logged-in user until they log
// back in if we trusted session.user.role for authorization. This re-reads
// the user's current role from the database on every call, so any
// admin-only or ownership check made against the result is always accurate,
// even against a stale JWT.
export async function getAuthUser() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return null;

    await connectDB();
    const dbUser = await UserModel.findOne({ email: session.user.email });
    return dbUser || null;
}
