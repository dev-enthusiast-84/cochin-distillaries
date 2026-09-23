import { Card } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { getProfile } from "@/lib/data";
import { AccountForm } from "./account-form";

export const metadata = { title: "Account" };

export default async function AccountPage() {
  const user = await requireUser("/account");
  const profile = await getProfile(user.id);

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="text-3xl font-semibold">Account</h1>
      <Card>
        <AccountForm email={user.email} profile={profile} />
      </Card>
    </div>
  );
}
