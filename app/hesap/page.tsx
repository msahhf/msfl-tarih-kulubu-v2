import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getSession } from "@/lib/auth/session";
import { userRepository, postRepository } from "@/lib/db/repositories";
import { Container } from "@/components/ui/Container";
import { ImageUploader } from "@/components/blog/ImageUploader";
import { logoutAction } from "@/lib/auth/actions";
import {
  updateProfileAction,
  updateSocialAction,
  updatePreferencesAction,
  changePasswordAction,
  deleteAccountAction,
} from "@/lib/account/actions";
import { toPlainTextExcerpt } from "@/lib/services/sanitize";
import type { Post, User } from "@/types";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

interface HesapPageProps {
  searchParams: Promise<{ success?: string; error?: string }>;
}

function Field({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium leading-none">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent";

export default async function HesapPage({ searchParams }: HesapPageProps) {
  const session = await getSession();
  if (!session) {
    redirect("/giris");
  }

  const resolvedSearch = await searchParams;

  let user: User | null = null;
  let userPosts: Post[] = [];

  try {
    user = await userRepository.findById(session._id as string);
    if (!user) {
      redirect("/giris");
    }
    userPosts = await postRepository.findByUserId(session._id as string);
  } catch (err) {
    console.error("Error fetching account data:", err);
  }

  const avatarImg = user?.avatar?.url
    ? [{ url: user.avatar.url, fileId: user.avatar.fileId }]
    : [];
  const coverImg = user?.coverImage?.url
    ? [{ url: user.coverImage.url, fileId: user.coverImage.fileId }]
    : [];

  return (
    <Container className="py-16">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-surface p-8 rounded-xl border border-border">
          <div className="flex items-center gap-5">
            {user?.avatar?.url ? (
              <Image
                src={user.avatar.url}
                alt={`${user.username} profil fotoğrafı`}
                width={72}
                height={72}
                className="w-[72px] h-[72px] rounded-full object-cover border border-border"
              />
            ) : (
              <div
                aria-hidden="true"
                className="w-[72px] h-[72px] rounded-full bg-accent/10 flex items-center justify-center text-accent font-display font-bold text-2xl"
              >
                {(user?.name?.[0] || session.username[0]).toUpperCase()}
              </div>
            )}
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-accent">
                Hesap Yönetimi
              </span>
              <h1 className="text-3xl font-display font-bold">@{user?.username ?? session.username}</h1>
              <p className="text-muted-foreground text-sm">{user?.email ?? session.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href={`/u/${user?.username ?? session.username}`}
              className="px-4 py-2 border border-border text-sm font-medium rounded-lg hover:bg-surface/80 transition-colors"
            >
              Profili Görüntüle
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="px-4 py-2 bg-destructive/10 text-destructive text-sm font-medium rounded-lg hover:bg-destructive/20 transition-colors"
              >
                Çıkış Yap
              </button>
            </form>
          </div>
        </header>

        {resolvedSearch.success && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-lg text-sm">
            {resolvedSearch.success}
          </div>
        )}

        {resolvedSearch.error && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-sm">
            {resolvedSearch.error}
          </div>
        )}

        {user && (
          <>
            {/* Profile Edit */}
            <section className="bg-surface p-8 rounded-xl border border-border space-y-6">
              <div className="space-y-1">
                <h2 className="text-xl font-display font-bold">Profil Bilgileri</h2>
                <p className="text-muted-foreground text-sm">
                  Kayıt tarihi: {new Date(user.date).toLocaleDateString("tr-TR")} • Rol:{" "}
                  <span className="uppercase text-accent font-semibold">{user.role}</span>
                </p>
              </div>
              <form action={updateProfileAction} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field id="name" label="Ad">
                    <input id="name" name="name" type="text" required defaultValue={user.name} className={inputClass} />
                  </Field>
                  <Field id="surname" label="Soyad">
                    <input id="surname" name="surname" type="text" required defaultValue={user.surname} className={inputClass} />
                  </Field>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field id="username" label="Kullanıcı Adı">
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      minLength={3}
                      maxLength={20}
                      defaultValue={user.username}
                      className={inputClass}
                    />
                  </Field>
                  <Field id="email" label="E-posta">
                    <input id="email" name="email" type="email" required defaultValue={user.email} className={inputClass} />
                  </Field>
                </div>
                <Field id="bio" label="Biyografi">
                  <textarea id="bio" name="bio" rows={3} maxLength={500} defaultValue={user.bio || ""} className={inputClass} />
                </Field>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <span className="text-sm font-medium leading-none" id="avatar-label">
                      Profil Fotoğrafı
                    </span>
                    <div role="group" aria-labelledby="avatar-label">
                      <ImageUploader name="avatar" initialImages={avatarImg} maxImages={1} folder="avatars" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <span className="text-sm font-medium leading-none" id="cover-label">
                      Kapak Fotoğrafı
                    </span>
                    <div role="group" aria-labelledby="cover-label">
                      <ImageUploader name="coverImage" initialImages={coverImg} maxImages={1} folder="covers" />
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-accent text-accent-foreground font-medium rounded-lg hover:opacity-90 transition-opacity text-sm"
                >
                  Profili Kaydet
                </button>
              </form>
            </section>

            {/* Social */}
            <section className="bg-surface p-8 rounded-xl border border-border space-y-6">
              <h2 className="text-xl font-display font-bold">Sosyal Medya</h2>
              <form action={updateSocialAction} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field id="instagram" label="Instagram">
                  <input id="instagram" name="instagram" type="text" defaultValue={user.social?.instagram || ""} placeholder="kullaniciadi" className={inputClass} />
                </Field>
                <Field id="x" label="X">
                  <input id="x" name="x" type="text" defaultValue={user.social?.x || ""} placeholder="kullaniciadi" className={inputClass} />
                </Field>
                <Field id="github" label="GitHub">
                  <input id="github" name="github" type="text" defaultValue={user.social?.github || ""} placeholder="kullaniciadi" className={inputClass} />
                </Field>
                <Field id="youtube" label="YouTube">
                  <input id="youtube" name="youtube" type="text" defaultValue={user.social?.youtube || ""} placeholder="kanal" className={inputClass} />
                </Field>
                <div className="sm:col-span-2">
                  <Field id="website" label="Website">
                    <input id="website" name="website" type="text" defaultValue={user.social?.website || ""} placeholder="https://..." className={inputClass} />
                  </Field>
                </div>
                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-accent text-accent-foreground font-medium rounded-lg hover:opacity-90 transition-opacity text-sm"
                  >
                    Sosyal Medyayı Kaydet
                  </button>
                </div>
              </form>
            </section>

            {/* Preferences */}
            <section className="bg-surface p-8 rounded-xl border border-border space-y-6">
              <div className="space-y-1">
                <h2 className="text-xl font-display font-bold">Gizlilik ve Veri Tercihleri</h2>
                <p className="text-muted-foreground text-sm">
                  Çerez ve veri kullanımı tercihlerinizi yönetin.
                </p>
              </div>
              <form action={updatePreferencesAction} className="space-y-4 text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="analyticsCookies" defaultChecked={user.analyticsCookies} className="rounded accent-accent" />
                  <span>Analitik çerezleri kullanımına izin ver</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="personalizationCookies" defaultChecked={user.personalizationCookies} className="rounded accent-accent" />
                  <span>Kişiselleştirme çerezlerine izin ver</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="serviceDataUsage" defaultChecked={user.serviceDataUsage} className="rounded accent-accent" />
                  <span>Hizmet verilerinin kullanımını onaylıyorum</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="personalizedContent" defaultChecked={user.personalizedContent} className="rounded accent-accent" />
                  <span>Kişiselleştirilmiş içerik gösterilmesini istiyorum</span>
                </label>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-accent text-accent-foreground font-medium rounded-lg hover:opacity-90 transition-opacity text-sm"
                >
                  Tercihleri Kaydet
                </button>
              </form>
            </section>

            {/* Password */}
            <section className="bg-surface p-8 rounded-xl border border-border space-y-6">
              <h2 className="text-xl font-display font-bold">Şifre Değiştir</h2>
              <form action={changePasswordAction} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Field id="currentPassword" label="Mevcut Şifre">
                    <input id="currentPassword" name="currentPassword" type="password" required autoComplete="current-password" className={inputClass} />
                  </Field>
                </div>
                <Field id="newPassword" label="Yeni Şifre (en az 8 karakter, büyük harf + rakam)">
                  <input id="newPassword" name="newPassword" type="password" required minLength={8} autoComplete="new-password" className={inputClass} />
                </Field>
                <Field id="newPasswordConfirm" label="Yeni Şifre (Tekrar)">
                  <input id="newPasswordConfirm" name="newPasswordConfirm" type="password" required minLength={8} autoComplete="new-password" className={inputClass} />
                </Field>
                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-accent text-accent-foreground font-medium rounded-lg hover:opacity-90 transition-opacity text-sm"
                  >
                    Şifreyi Güncelle
                  </button>
                </div>
              </form>
            </section>

            {/* Danger zone */}
            <section className="bg-surface p-8 rounded-xl border border-destructive/30 space-y-6">
              <div className="space-y-1">
                <h2 className="text-xl font-display font-bold text-destructive">Hesabı Sil</h2>
                <p className="text-muted-foreground text-sm">
                  Hesabınız, yazılarınız ve yorumlarınız kalıcı olarak silinir.
                  Verileriniz silinmeden önce yedeklenir. Bu işlem geri alınamaz.
                </p>
              </div>
              <form action={deleteAccountAction} className="flex flex-col sm:flex-row gap-4 sm:items-end">
                <div className="flex-1">
                  <Field id="delete-password" label="Onay için şifreniz">
                    <input id="delete-password" name="password" type="password" required autoComplete="current-password" className={inputClass} />
                  </Field>
                </div>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-destructive text-destructive-foreground font-medium rounded-lg hover:opacity-90 transition-opacity text-sm whitespace-nowrap"
                >
                  Hesabı Kalıcı Olarak Sil
                </button>
              </form>
            </section>
          </>
        )}

        {/* User Posts Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h2 className="text-2xl font-display font-bold">Yazılarım ({userPosts.length})</h2>
            <Link
              href="/blog/olustur"
              className="px-4 py-2 bg-accent text-accent-foreground text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
            >
              + Yeni Yazı Oluştur
            </Link>
          </div>

          {userPosts.length === 0 ? (
            <div className="text-center py-12 bg-surface rounded-xl border border-border text-muted-foreground text-sm">
              Henüz bir blog yazısı oluşturmadınız.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userPosts.map((post) => {
                const postId = post._id.toString();
                return (
                  <div key={postId} className="bg-surface p-6 rounded-xl border border-border flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <span className="text-xs text-muted-foreground">
                        {new Date(post.date).toLocaleDateString("tr-TR")}
                      </span>
                      <h3 className="font-display font-bold text-lg text-foreground">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground text-sm line-clamp-2">
                        {toPlainTextExcerpt(post.content, 160)}
                      </p>
                    </div>
                    <div className="pt-2">
                      <Link
                        href={`/blog/${postId}`}
                        className="text-sm font-semibold text-accent hover:underline"
                      >
                        Yazıyı Görüntüle →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
