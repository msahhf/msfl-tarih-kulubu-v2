import LoginForm from "@/components/auth/LoginForm";

export const metadata = {
  title: "Giriş Yap",
  description: "MSFL Tarih Kulübü hesabınıza giriş yapın.",
};

export default function LoginPage() {
  return (
    <main className="min-h-[calc(100vh-10rem)] flex items-center justify-center px-4 py-16">
      <LoginForm />
    </main>
  );
}
