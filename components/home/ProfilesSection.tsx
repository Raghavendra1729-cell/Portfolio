import { getData } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";

export default async function ProfilesSection() {
  const profiles = await getData("cpProfile");
  
  if (!profiles || profiles.length === 0) {
    return null;
  }

  // Filter for visible profiles
  const visibleProfiles = profiles.filter(p => p.isVisible !== false);

  if (visibleProfiles.length === 0) {
    return null;
  }

  // Sort by order
  visibleProfiles.sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <section className="mb-12 mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {visibleProfiles.map((profile) => (
        <a 
          key={profile._id}
          href={profile.url || profile.profileUrl || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-md"
        >
          {profile.picture || (profile.images && profile.images.length > 0) ? (
            <div className="relative h-16 w-16 overflow-hidden rounded-full border border-border shrink-0">
              <Image 
                src={profile.picture || (profile.images && profile.images[0]) || ""} 
                alt={profile.name || profile.platform || "Profile"} 
                fill 
                className="object-cover"
              />
            </div>
          ) : (
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
              {(profile.name?.[0] || profile.platform?.[0] || "?").toUpperCase()}
            </div>
          )}
          
          <div className="flex flex-col">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {profile.name || profile.platform}
            </h3>
            {(profile.summary || profile.headline) && (
              <p className="line-clamp-2 text-sm text-muted-foreground mt-1">
                {profile.summary || profile.headline}
              </p>
            )}
          </div>
        </a>
      ))}
    </section>
  );
}
