import dbConnect from "@/lib/mongodb";

export type SeedStep = {
  collection: string;
  label: string;
  action: "created" | "skipped";
  inserted: number;
  reason?: string;
};

export type SeedResult = {
  success: true;
  steps: SeedStep[];
  totals: {
    createdCollections: number;
    skippedCollections: number;
    insertedDocuments: number;
  };
};

export async function runPortfolioSeed(): Promise<SeedResult> {
  await dbConnect();

  return {
    success: true,
    steps: [
      {
        collection: "all",
        label: "Database",
        action: "skipped",
        inserted: 0,
        reason: "Data is managed via the admin dashboard. Seed is disabled.",
      },
    ],
    totals: {
      createdCollections: 0,
      skippedCollections: 1,
      insertedDocuments: 0,
    },
  };
}
