import { redirect } from 'next/navigation';

// Jobs are listed on the homepage Job Board; /jobs/ only holds the detail pages.
export default function JobsIndex() {
  redirect('/#jobs');
}
