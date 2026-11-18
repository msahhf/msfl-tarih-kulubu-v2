import { magazineIssues } from "@/content/magazine";
import { magazineNoteRepository } from "@/lib/db/repositories";
import type { PublicMagazineNote } from "@/types/magazine-note";

/** Yalnızca yayımdaki (kayıtlı) sayılara not bırakılabilir. */
export function isKnownMagazineIssue(slug: string): boolean {
  return magazineIssues.some((issue) => issue.slug === slug);
}

export function findMagazineIssue(slug: string) {
  return magazineIssues.find((issue) => issue.slug === slug) ?? null;
}

/**
 * Bir sayının okuyucu notlarını istemciye güvenli biçimde döndürür.
 * Veritabanı erişilemezse dergi sayfası çökmesin diye boş liste döner.
 */
export async function listMagazineNotes(
  issueSlug: string
): Promise<PublicMagazineNote[]> {
  if (!isKnownMagazineIssue(issueSlug)) return [];

  try {
    const notes = await magazineNoteRepository.findByIssue(issueSlug);
    return notes.map(magazineNoteRepository.toPublicNote);
  } catch (error) {
    console.error("Dergi okuyucu notları yüklenemedi:", error);
    return [];
  }
}
