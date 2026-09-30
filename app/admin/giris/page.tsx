import { redirect } from "next/navigation";
import { isAdminSession } from "@/lib/admin/auth";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export default async function AdminLoginPage() {
  if (await isAdminSession()) {
    redirect("/admin/dashboard");
  }
  return <AdminLoginForm />;
}
