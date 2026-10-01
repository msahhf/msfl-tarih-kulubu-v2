import RegisterForm from "@/components/auth/RegisterForm";

export const metadata = {
  title: "Kayıt Ol",
  description: "MSFL Tarih Kulübü topluluğuna katılın.",
};

export default function RegisterPage() {
  return (
    <main className="min-h-[calc(100vh-10rem)] flex items-center justify-center px-4 py-16">
      <RegisterForm />
    </main>
  );
}
