import Link from 'next/link';
import { applyHref, getPublishedJobs } from '@/lib/job-board';
import { formatStartDate, jobPath, localizedContent } from '@/lib/job-fields';
import { SCHOOL_POST_JOB_FORM_URL } from '@/lib/site';

/** One value per language: shown/hidden by the site's html[lang] en-only / ko-only rules. */
function Bilingual({ en, ko }: { en: string; ko: string }) {
  if (en === ko) return <>{en}</>;
  return (
    <>
      <span className="en-only">{en}</span>
      <span className="ko-only">{ko}</span>
    </>
  );
}

/**
 * Job Board section of the homepage and /jobs/: a card per published job. Styles: styles/site.css
 * (.jobs-board, .job-card); the data-i18n labels are translated by public/js/site.js.
 */
export async function JobBoard() {
  const jobs = await getPublishedJobs();

  return (
    <section id="jobs" className="home-jobs-preview">
      <div className="wrap jobs-board" id="jobs-board">
        <div className="section-head">
          <h2 data-i18n="jobs.title">Job Board · Open Positions</h2>
          <span className="meta" data-i18n="jobs.meta">
            School-posted positions · Apply Now
          </span>
        </div>
        <div className="jobs-grid" id="jobs-grid">
          {jobs.length ? (
            jobs.map((job) => {
              const en = job.en;
              const ko = localizedContent(job.en, job.ko);
              const row = (labelKey: string, label: string, value: React.ReactNode) => (
                <tr>
                  <td data-i18n={labelKey}>{label}</td>
                  <td>{value}</td>
                </tr>
              );
              return (
                <div key={job.id} className="job-card">
                  <div className="top">
                    <span className="type">
                      <Bilingual en={en.type} ko={ko.type} />
                    </span>
                    {job.badge && (
                      <span className={job.badge} data-i18n={`jobs.badge.${job.badge}`}>
                        {job.badge === 'urgent' ? 'Urgent' : 'New'}
                      </span>
                    )}
                  </div>
                  <h3>
                    <Bilingual en={en.title} ko={ko.title} />
                  </h3>
                  <div className="school">{job.school}</div>
                  <table>
                    <tbody>
                      {row('jobs.col.location', 'Location', <Bilingual en={en.location} ko={ko.location} />)}
                      {row('jobs.col.salary', 'Salary', <Bilingual en={en.salary} ko={ko.salary} />)}
                      {row('jobs.col.start', 'Start date', formatStartDate(job.startDate))}
                      {row('jobs.col.housing', 'Housing', <Bilingual en={en.housing} ko={ko.housing} />)}
                      {row('jobs.col.rating', 'Rating', job.rating)}
                      {row('jobs.col.response', 'Response', <Bilingual en={en.response} ko={ko.response} />)}
                    </tbody>
                  </table>
                  <Link className="view-detail-btn" href={jobPath(job)} data-i18n="jobs.viewDetail">
                    View job details →
                  </Link>
                  <div className="job-card-actions">
                    <Link className="apply-btn" href={applyHref(job)} data-i18n="jobs.apply">
                      Apply Now
                    </Link>
                    <a
                      className="post-job-btn"
                      href={SCHOOL_POST_JOB_FORM_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-i18n="jobs.post"
                    >
                      Post a Job
                    </a>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="job-card job-card-empty">
              <h3>
                <Bilingual en="No open positions right now" ko="현재 오픈 포지션이 없습니다" />
              </h3>
              <div className="school">
                <Bilingual
                  en="New school postings appear here after review."
                  ko="새 공고는 검토 후 이곳에 표시됩니다."
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
