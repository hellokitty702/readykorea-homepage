import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { JsonLd } from '@/components/json-ld';
import type { JobContent, JobFaq } from '@/lib/db/schema';
import { applyHref, getPublishedJob, getPublishedJobs } from '@/lib/job-board';
import { formatStartDate, jobPath, localizedContent } from '@/lib/job-fields';
import { SITE_NAME, absoluteUrl } from '@/lib/site';

type Props = { params: Promise<{ slug: string }> };

// Published jobs are prerendered; one published later renders on its first visit. Saving a job in
// the admin panel revalidates these pages (lib/actions/jobs.ts).
export async function generateStaticParams() {
  return (await getPublishedJobs()).map((job) => ({ slug: job.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const job = await getPublishedJob((await params).slug);
  if (!job) return {};
  const title = `${job.en.title} · ${job.school}`;
  const description = [
    `${job.en.title} at ${job.school}, ${job.en.location}.`,
    job.en.salary && `${job.en.salary}.`,
    job.startDate && `Start ${formatStartDate(job.startDate)}.`,
    'Apply with ReadyKorea.',
  ]
    .filter(Boolean)
    .join(' ');
  return {
    title: `${title} | ReadyKorea`,
    description,
    alternates: { canonical: jobPath(job) },
    openGraph: { type: 'website', title, description, url: jobPath(job), siteName: SITE_NAME },
  };
}

const LABELS = {
  back: ['← Back to Job Board', '← Job Board로 돌아가기'],
  highlights: ['Key Highlights', '핵심 정보'],
  benefits: ['Compensation & Benefits', '급여 및 복리후생'],
  distinctive: ['Why This School is Distinctive?', '이 학원의 특징은?'],
  faq: ['Quick Answers', '빠른 답변'],
  apply: ['Apply Now', '지원하기'],
  jobId: ['JOB ID', '공고 ID'],
  new: ['New', '신규'],
  urgent: ['Urgent', '긴급'],
} as const;

type SpecKey = Exclude<keyof JobContent, 'faq'> | 'startDate';
const HIGHLIGHTS: [SpecKey, string, string][] = [
  ['startDate', 'Start Date', '시작일'],
  ['workingHours', 'Working Hours', '근무 시간'],
  ['monthlySalary', 'Monthly Salary', '월급'],
  ['housingType', 'Housing Type', '주거 유형'],
  ['studentAge', 'Student Age/Type', '학생 연령/유형'],
  ['location', 'Location', '위치'],
  ['workingDays', 'Working Days', '근무 요일'],
  ['openings', 'Number of Openings', '모집 인원'],
];
const BENEFITS: [SpecKey, string, string][] = [
  ['salaryDetails', 'Salary Details', '급여 상세'],
  ['housingPolicy', 'Housing Policy', '주거 정책'],
  ['vacation', 'Vacation / Sick Leave', '휴가 / 병가'],
  ['severance', 'Severance', '퇴직금'],
  ['insurance', 'Insurance / Pension', '보험 / 연금'],
  ['airfare', 'Airfare', '항공권'],
];

/** Both languages in the markup; the site's html[lang] rules show one (EN/KO switch in the header). */
function T({ en, ko }: { en: ReactNode; ko: ReactNode }) {
  if (en === ko) return <>{en}</>;
  return (
    <>
      <span className="en-only">{en}</span>
      <span className="ko-only">{ko}</span>
    </>
  );
}

function Label({ name }: { name: keyof typeof LABELS }) {
  const [en, ko] = LABELS[name];
  return <T en={en} ko={ko} />;
}

function FaqList({ items }: { items: JobFaq[] }) {
  return (
    <div className="job-detail-faq-list">
      {items.map((item, i) => (
        <details key={i} className="job-detail-faq-item">
          <summary>{item.q}</summary>
          <p>{item.a}</p>
        </details>
      ))}
    </div>
  );
}

export default async function JobPage({ params }: Props) {
  const job = await getPublishedJob((await params).slug);
  if (!job) notFound();

  const startDate = formatStartDate(job.startDate);
  const en = { ...job.en, startDate };
  const ko = { ...localizedContent(job.en, job.ko), startDate };
  const sameFaq = JSON.stringify(en.faq) === JSON.stringify(ko.faq);

  const specs = (rows: [SpecKey, string, string][]) =>
    rows
      .filter(([key]) => en[key] || ko[key])
      .map(([key, labelEn, labelKo]) => (
        <div key={key} className="jd-spec-row">
          <dt>
            <T en={labelEn} ko={labelKo} />
          </dt>
          <dd>
            <T en={en[key]} ko={ko[key]} />
          </dd>
        </div>
      ));

  return (
    <main className="job-page">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'JobPosting',
          title: job.en.title,
          description: [job.en.distinctive, job.en.salaryDetails, job.en.housingPolicy].filter(Boolean).join('\n\n'),
          identifier: { '@type': 'PropertyValue', name: SITE_NAME, value: job.code },
          datePosted: (job.publishedAt ?? job.createdAt).toISOString().slice(0, 10),
          employmentType: 'FULL_TIME',
          hiringOrganization: { '@type': 'Organization', name: job.school },
          jobLocation: {
            '@type': 'Place',
            address: { '@type': 'PostalAddress', addressLocality: job.en.location, addressCountry: 'KR' },
          },
          url: absoluteUrl(jobPath(job)),
        }}
      />
      <div className="wrap">
        {/* Plain link: the homepage needs a full load to run its scripts. */}
        <a className="job-detail-back" href="/#jobs">
          <Label name="back" />
        </a>
        <article className="job-detail-page">
          <header className="job-detail-header">
            {job.badge && (
              <span className={`job-detail-badge is-${job.badge}`}>
                <Label name={job.badge} />
              </span>
            )}
            <p className="job-detail-school">{job.school}</p>
            <h1 className="job-detail-title">
              <T en={en.title} ko={ko.title} />
            </h1>
            <div className="job-detail-header-meta">
              <span className="job-detail-meta-chip">
                <T en={en.location} ko={ko.location} />
              </span>
              <span className="job-detail-meta-chip is-salary">
                <T en={en.salary} ko={ko.salary} />
              </span>
            </div>
          </header>

          <div className="job-detail-body">
            <div className="job-detail-grid">
              <div className="job-detail-col job-detail-highlights">
                <h2>
                  <Label name="highlights" />
                </h2>
                <dl className="jd-spec-list">{specs(HIGHLIGHTS)}</dl>
              </div>
              <div className="job-detail-col job-detail-benefits">
                <h2>
                  <Label name="benefits" />
                </h2>
                <dl className="jd-spec-list">{specs(BENEFITS)}</dl>
              </div>
            </div>

            {(en.distinctive || ko.distinctive) && (
              <div className="job-detail-distinctive">
                <h2>
                  <Label name="distinctive" />
                </h2>
                <p>
                  <T en={en.distinctive} ko={ko.distinctive} />
                </p>
              </div>
            )}

            {(en.faq.length > 0 || ko.faq.length > 0) && (
              <div className="job-detail-faq">
                <h2>
                  <Label name="faq" />
                </h2>
                {sameFaq ? (
                  <FaqList items={en.faq} />
                ) : (
                  <>
                    <div className="en-only">
                      <FaqList items={en.faq} />
                    </div>
                    <div className="ko-only">
                      <FaqList items={ko.faq} />
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="job-detail-apply-wrap">
            <Link className="job-detail-apply" href={applyHref(job)}>
              <span>
                <Label name="apply" />
              </span>
              <span className="job-id">
                <Label name="jobId" />: {job.code}
              </span>
            </Link>
          </div>
        </article>
      </div>
    </main>
  );
}
