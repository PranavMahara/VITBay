import React from "react";
import credits from "../data/photo-credits.json";
import { useTitle } from "../lib/hooks";

export default function Credits() {
  useTitle("Photo credits");
  return (
    <main className="container narrow page prose">
      <h1>Photo credits</h1>
      <p className="lead">
        The starter listings on VITBay use these photos, shared by their authors under free licences. Thank you to everyone who shares their
        work.
      </p>
      <ul className="credits">
        {credits.map((c) => (
          <li key={c.image}>
            <img src={c.image} alt="" loading="lazy" />
            <span>
              {c.source ? (
                <a href={c.source} target="_blank" rel="noreferrer">
                  {c.title || "Photo"}
                </a>
              ) : (
                c.title
              )}
              {c.creator && <> by {c.creator_url ? <a href={c.creator_url} target="_blank" rel="noreferrer">{c.creator}</a> : c.creator}</>}
              {c.license && (
                <>
                  {", "}
                  {c.license_url ? (
                    <a href={c.license_url} target="_blank" rel="noreferrer">
                      {c.license}
                    </a>
                  ) : (
                    c.license
                  )}
                </>
              )}
              . Resized.
            </span>
          </li>
        ))}
      </ul>
    </main>
  );
}
