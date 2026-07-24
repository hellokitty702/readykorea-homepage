# Generates SUPPORT_GUIDE_TOPICS for david-esl-homepage.html
$categories = [ordered]@{
  'Immigration' = @(
    @('How to book a HiKorea appointment', 'Select Non-member appointment, enter ARC or passport, save your password for cancellations.', 'hikorea appointment non-member arc passport password'),
    @('Find your local immigration office', 'Use the HiKorea Jurisdiction Finder with your registered Korean address.', 'immigration office jurisdiction hikorea address branch'),
    @('ARC pickup appointment tips', 'Book early morning slots in March and August peak seasons.', 'arc pickup appointment immigration wait'),
    @('Visa extension before expiry', 'Apply 4 months before E-2 expiry to avoid overstay risk.', 'visa extension e-2 renewal hikorea'),
    @('Change employer on E-2 visa', 'Release letter, new contract, and immigration filing sequence.', 'change employer e-2 release letter transfer'),
    @('Re-entry permit single vs multiple', 'Multiple re-entry recommended if you travel often.', 're-entry permit single multiple travel'),
    @('Address change registration', 'Report new address within 14 days of moving.', 'address change registration alien move'),
    @('Immigration office peak seasons', 'March EPIK arrivals and August renewals mean longer waits.', 'immigration wait times march august'),
    @('What to bring to immigration', 'Passport, ARC, forms, photos, and appointment printout.', 'immigration documents checklist appointment'),
    @('Cancel or reschedule HiKorea appointment', 'Use your saved non-member appointment password online.', 'cancel hikorea appointment reschedule password'),
    @('Seoul immigration branch guide', 'Gangseo vs Seongbuk jurisdiction split in metro Seoul.', 'seoul immigration gangseo seongbuk'),
    @('Gyeonggi immigration offices overview', 'Suwon, Uijeongbu, Incheon, and Pyeongtaek branches.', 'gyeonggi immigration suwon uijeongbu'),
    @('Busan immigration office guide', 'Main Busan office for Haeundae and Seomyeon teachers.', 'busan immigration haeundae'),
    @('Incheon and Songdo immigration', 'Western corridor teachers use Incheon jurisdiction.', 'incheon immigration songdo'),
    @('Daegu immigration for Yeongnam', 'Inland EPIK placements use Daegu office.', 'daegu immigration epik yeongnam'),
    @('Jeju island immigration basics', 'Single Jeju City office for island residents.', 'jeju immigration island arc'),
    @('Overstay grace period risks', 'Never rely on informal grace - file before expiry.', 'overstay visa expiry penalty korea'),
    @('Immigration form MOFA downloads', 'Official forms for visa change and reporting.', 'immigration forms download mofa')
  )
  'Visa & E-2' = @(
    @('E-2 visa document checklist 2026', 'Apostilled degree, FBI check, and contract basics for US citizens.', 'e-2 visa checklist documents 2026 apostille'),
    @('Apostille vs notarization explained', 'Korean consulates require apostille on criminal records.', 'apostille notarization fbi degree'),
    @('FBI background check timeline', 'Allow 8-12 weeks; electronic options may be faster.', 'fbi background check channeler timeline'),
    @('Consulate appointment booking tips', 'Book embassy slots as soon as visa issuance letter arrives.', 'consulate appointment embassy korea visa'),
    @('Visa issuance number (VIN) step', 'Employer submits VIN; you complete consulate visit.', 'visa issuance number vin employer'),
    @('E-2 vs F-visa tutoring rules', 'E-2 prohibits private tutoring; F-visas allow extra income.', 'e-2 f-visa tutoring private lessons legal'),
    @('Canadian RCMP check for E-2', 'RCMP criminal record with apostille for Canadian citizens.', 'canada rcmp e-2 visa apostille'),
    @('UK DBS check for Korea visa', 'ACRO police certificate pathway for British applicants.', 'uk dbs acro korea visa'),
    @('Australian AFP check guide', 'AFP national police check apostille process.', 'australia afp police check korea'),
    @('Irish police certificate for E-2', 'Garda vetting and apostille for Irish teachers.', 'ireland garda police certificate e-2'),
    @('South African SAPS check', 'SAPS police clearance for Korean work visa.', 'south africa saps police clearance'),
    @('New Zealand MOJ criminal record', 'MOJ certificate requirements for NZ citizens.', 'new zealand moj criminal record korea'),
    @('Sealed transcripts myth', 'Paper sealed transcripts are no longer required by most consulates.', 'sealed transcripts consulate requirement'),
    @('Visa run alternatives', 'Proper extension or employer change beats risky visa runs.', 'visa run korea extension'),
    @('E-2 eligibility countries list', 'Seven English-speaking countries qualify for standard E-2.', 'e-2 eligible countries list'),
    @('Degree authentication FAQ', 'Bachelor degree in any field typically sufficient for hagwon.', 'degree authentication bachelor requirement')
  )
  'ARC & Residence' = @(
    @('ARC application first week in Korea', 'School should escort you; bring passport and photos.', 'arc application first week alien registration'),
    @('ARC card pickup timeline', 'Usually 2-3 weeks; temporary slip allows banking.', 'arc pickup waiting period slip'),
    @('Lost ARC replacement process', 'Report loss and reapply at immigration with fee.', 'lost arc replacement immigration'),
    @('ARC back-of-card address update', 'Address printed on ARC must match registration.', 'arc address update back card'),
    @('Temporary ARC slip uses', 'Open bank account and phone plan before card arrives.', 'arc slip temporary banking phone'),
    @('Foreigner registration timeline', 'Complete within 90 days of entry on long-term visa.', 'foreigner registration 90 days'),
    @('ARC for spouse F-6 holders', 'Marriage visa ARC process differs from E-2.', 'f-6 arc spouse registration'),
    @('Renewing ARC at expiry', 'Book HiKorea before card expiration date.', 'arc renewal expiry immigration'),
    @('ARC photo specifications', 'White background 3.5x4.5 cm standard.', 'arc photo size specification immigration'),
    @('Employer ARC sponsorship letter', 'School director letter may be required at appointment.', 'employer letter arc sponsorship'),
    @('ARC and re-entry permit combo visit', 'Combine appointments when possible to save trips.', 'arc re-entry same appointment'),
    @('Digital ARC on HiKorea', 'Check online status while waiting for physical card.', 'digital arc status hikorea'),
    @('ARC name spelling errors', 'Fix passport name mismatches immediately at immigration.', 'arc name spelling correction'),
    @('Moving cities ARC update', 'New address registration triggers jurisdiction change.', 'moving city arc update immigration')
  )
  'Banking & Money' = @(
    @('Open a Korean bank account guide', 'Passport, ARC or slip, and Korean phone number needed.', 'bank account korea arc passport open'),
    @('Shinhan vs KB vs Woori for expats', 'English app quality and branch English service compared.', 'shinhan kb woori bank expat english'),
    @('Sending money home Wise vs bank', 'Wise and Sentbe often beat wire transfer fees.', 'wise remittance korea send money home'),
    @('KakaoPay and Naver Pay setup', 'Link Korean bank for mobile payments everywhere.', 'kakaopay naver pay setup bank'),
    @('ATM foreign card fees', 'Use global ATMs; withdraw larger amounts less often.', 'atm fees foreign card korea'),
    @('Salary pay day Korean practice', 'Most schools pay 25th or last business day.', 'salary pay day korea hagwon'),
    @('Tax refund year-end filing', 'File March year-end income tax if you owe or are due refund.', 'tax refund year end filing korea'),
    @('Multi-currency account options', 'Some banks offer USD side accounts for savings.', 'multi currency account korea'),
    @('Joint account with Korean partner', 'Requirements vary; ARC and relationship proof.', 'joint bank account korea spouse'),
    @('Bankruptcy-proof severance account', 'Severance must be paid to designated account.', 'severance account korea labor law'),
    @('Cash culture vs card Korea', 'Cards accepted almost everywhere; keep some cash.', 'cash card korea payment culture'),
    @('Exchange won at airport vs bank', 'Bank or ATM usually better than airport counter rates.', 'exchange rate airport bank korea')
  )
  'Housing' = @(
    @('Defeating mold in Korean officetels', 'Dehumidifiers, ventilation, and hygrometer essentials.', 'mold officetel humidity dehumidifier'),
    @('Jeonse vs wolse vs monthly rent', 'Deposit systems differ from Western leases.', 'jeonse wolse deposit rent korea'),
    @('School-provided housing inspection', 'Document damage on move-in day with photos.', 'school housing inspection move in'),
    @('Breaking lease early penalties', 'Read contract; employer housing may have separate rules.', 'break lease early penalty korea'),
    @('Key money and maintenance fees', 'Management fee (gwanbi) added to monthly rent.', 'management fee gwanbi officetel'),
    @('Floor heating ondol winter costs', 'Gas bills spike December-February.', 'ondol floor heating gas bill winter'),
    @('Finding housing after school contract', 'Dabang and Zigbang apps with agent help.', 'dabang zigbang find apartment korea'),
    @('Guarantor systems for foreigners', 'Some landlords require Korean guarantor or agency.', 'guarantor foreigner rent korea'),
    @('Utilities setup electricity gas water', 'Register accounts after ARC and address.', 'utilities setup electricity gas water'),
    @('Internet installation for new apartment', 'KT and SK broadband; English support varies.', 'internet installation kt sk broadband'),
    @('Noise complaints in apartments', 'Thin walls - quiet hours matter for neighbors.', 'noise apartment thin walls korea'),
    @('Recycling and trash disposal rules', 'Sorted bags by district; violation fines possible.', 'trash recycling bags district korea'),
    @('Cockroach and pest prevention', 'Seal food; summer pest season in older buildings.', 'pest cockroach prevention officetel'),
    @('Room temperature summer humidity', 'AC vs fan costs and mold prevention balance.', 'summer humidity air conditioning mold'),
    @('Housing near subway vs hagwon', 'Commute under 40 minutes ideal for hagwon hours.', 'commute subway housing hagwon'),
    @('Move-out cleaning checklist', 'Professional cleaning often required for deposit return.', 'move out cleaning deposit return')
  )
  'Healthcare' = @(
    @('National Health Insurance enrollment', 'Auto-enrolled via employer; verify deduction on payslip.', 'national health insurance nhi enrollment'),
    @('Finding English-speaking clinics', 'Expat districts and hospital international desks.', 'english speaking doctor clinic seoul'),
    @('Dental care costs in Korea', 'Cleaning and checkups far cheaper than US/UK.', 'dental cleaning cost korea nhi'),
    @('Mental health resources for expats', 'Counseling centers with English service in Seoul.', 'mental health counseling english seoul'),
    @('Pharmacy without prescription limits', 'Many meds OTC; antibiotics need prescription.', 'pharmacy prescription otc korea'),
    @('Emergency room vs urgent care', 'ER cheap with NHI; bring ARC and insurance card.', 'emergency room cost nhi korea'),
    @('OBGYN and women health abroad', 'English OB clinics in Gangnam and Itaewon.', 'obgyn english seoul women health'),
    @('Allergies and air quality AQI', 'Yellow dust spring; mask and air purifier season.', 'air quality aqi yellow dust allergy'),
    @('Health insurance for dependents', 'Spouse and children enrollment via employer.', 'dependent health insurance spouse child'),
    @('COVID-era telemedicine norms', 'Many clinics still offer app-based consults.', 'telemedicine app korea clinic')
  )
  'Workplace' = @(
    @('Essential Korean workplace etiquette', 'Bow, two-hand card exchange, and hierarchy basics.', 'workplace etiquette bow hierarchy korea'),
    @('Co-teacher relationship tips', 'Public school co-teachers can make or break year.', 'co-teacher epik public school relationship'),
    @('Open class parent observation survival', 'Parent observation days in kindergartens.', 'open class parent observation kindergarten'),
    @('Saturday class contract clause', 'Verify paid vs unpaid Saturday teaching hours.', 'saturday class hagwon contract hours'),
    @('Overtime pay Korean labor law', 'Document extra hours; unpaid OT is common dispute.', 'overtime pay labor law hagwon'),
    @('Sick day policies hagwon vs public', 'Public schools more formal sick leave process.', 'sick day policy hagwon epik'),
    @('Dress code for kindergarten teachers', 'Business casual; avoid revealing or loud prints.', 'dress code kindergarten teacher korea'),
    @('Parent Kakao communication norms', 'School may require Korean messaging app updates.', 'kakao parents communication kindergarten'),
    @('Performance reviews and contract renewal', 'March and September renewal cycles.', 'contract renewal performance review hagwon'),
    @('Desk warming winter vacation pay', 'Verify paid winter break days in contract.', 'desk warming vacation pay hagwon'),
    @('Native teacher vs Korean teacher roles', 'Clarify responsibilities before signing.', 'native teacher role korean teacher hagwon'),
    @('Professional development expectations', 'Some chains require training weekends.', 'training weekend poly slp kindergarten'),
    @('Switching hagwons mid-contract', 'Immigration release and timing risks.', 'switch hagwon mid contract release'),
    @('Burnout signs and recovery', 'Hagwon hours and parent pressure management.', 'burnout hagwon teacher korea')
  )
  'Contracts' = @(
    @('Contract red flags before signing', 'Illegal clauses on flight refund and arbitrary fines.', 'contract red flags hagwon signing'),
    @('Housing allowance vs provided apartment', 'Verify size, distance, and furnishing list.', 'housing allowance provided apartment contract'),
    @('Severance pay eligibility rules', 'One year employment triggers severance entitlement.', 'severance pay one year korea labor'),
    @('Probation period Korean contracts', '90-day probation common; know termination rules.', 'probation period 90 days contract'),
    @('Non-compete clauses enforceability', 'Often unenforceable but still stressful if signed.', 'non compete clause hagwon korea'),
    @('Flight reimbursement conditions', 'Round-trip or one-way; repayment if early quit.', 'flight reimbursement contract early termination'),
    @('Insurance and pension employer share', 'Employer must contribute to NPS and NHI.', 'pension nps employer contribution'),
    @('Illegal deduction from salary', 'Uniform or materials fees may be unlawful.', 'salary deduction illegal hagwon'),
    @('Written contract vs verbal promises', 'Only signed Korean/English contract counts legally.', 'written contract verbal promise korea'),
    @('Consulting a labor attorney', 'Seoul Global Center free labor counseling.', 'labor attorney seoul global center'),
    @('EPIK contract vs hagwon contract', 'Government template vs private academy terms.', 'epik contract vs hagwon'),
    @('Notice period resignation rules', '30-60 days notice typical; immigration timing.', 'resignation notice period e-2')
  )
  'Transport' = @(
    @('T-money card setup and recharge', 'Convenience store recharge; tap in/out subway.', 't-money card subway recharge'),
    @('Subway rush hour survival', 'Lines 2 and 9 packed 8-9am and 6-7pm.', 'subway rush hour seoul packed'),
    @('Kakao T taxi for foreigners', 'English app; receipt and route tracking.', 'kakao t taxi app english'),
    @('Late night bus after hagwon', 'Owl buses and last subway times by line.', 'late night bus owl subway last train'),
    @('KTX booking for weekend travel', 'Korail app; peak holiday sellout early.', 'ktx booking korail weekend travel'),
    @('International driving permit Korea', 'IDP required; conversion to Korean license later.', 'international driving permit idp korea'),
    @('Bicycle rules in Seoul', 'Han river paths; sidewalk riding restrictions.', 'bicycle han river seoul rules'),
    @('Airport AREX vs taxi Incheon', 'AREX express to Seoul Station vs direct taxi cost.', 'arex incheon airport seoul taxi'),
    @('Busan metro vs Seoul scale', 'Smaller system; beach districts bus-heavy.', 'busan metro transportation beach'),
    @('Jeju car rental for teachers', 'Car recommended; international license rules.', 'jeju car rental international license'),
    @('Delivery apps Coupang Eats Baemin', 'English interfaces improving; address in Korean helps.', 'coupang eats baemin delivery english'),
    @('Scooter and kickboard regulations', 'Helmet and license rules tightened recently.', 'scooter kickboard license korea')
  )
  'Daily Life' = @(
    @('Coupang overnight delivery culture', 'Order by midnight, receive by morning.', 'coupang delivery overnight korea'),
    @('Convenience store GS25 CU guide', 'ATMs, packages, and hot meals 24/7.', 'gs25 cu convenience store guide'),
    @('Grocery shopping Homeplus Emart', 'Foreign food aisles in expat neighborhoods.', 'homeplus emart foreign food grocery'),
    @('Korean spam and doorbell scams', 'Ignore unknown delivery claims; verify building office.', 'spam scam doorbell korea'),
    @('Laundry and dry cleaning costs', 'Self-service laundromats widespread.', 'laundromat dry cleaning korea cost'),
    @('Hair salon English communication', 'Show photo; Gangnam salons used to foreigners.', 'hair salon english seoul gangnam'),
    @('Gym membership and fitness culture', 'Monthly gym 50-80k won; verify cancellation.', 'gym membership fitness korea cancel'),
    @('Costco membership for expats', 'Bulk shopping; card and car access tips.', 'costco korea membership expat'),
    @('Seasonal clothing packing list', 'Humid summer, heated winter indoors.', 'packing list seasons korea humidity'),
    @('Public WiFi and SIM cards', 'Prepaid SIM at airport vs long-term plan.', 'sim card prepaid korea airport wifi')
  )
  'Korean Language' = @(
    @('Hangul in one weekend', 'Alphabet is logical; start before arrival.', 'hangul learn alphabet weekend'),
    @('Survival phrases for teachers', 'Classroom commands and parent greetings.', 'korean phrases classroom parents'),
    @('TOPIK exam for F-2 points', 'Points-based visa upgrade pathway.', 'topik exam f-2 visa points'),
    @('Free Korean classes Seoul Global', 'District and global center free classes.', 'free korean class seoul global center'),
    @('KakaoTalk etiquette', 'Read receipts and group chat culture.', 'kakaotalk etiquette read receipt'),
    @('Naver Dictionary vs Papago', 'Best apps for lesson planning and daily life.', 'naver dictionary papago translate'),
    @('Learning honorifics for workplace', 'Yo vs banmal with coworkers and directors.', 'honorifics workplace korean banmal'),
    @('Night Korean hagwon worth it', 'After-work classes for motivated teachers.', 'korean night class hagwon language')
  )
  'Regional' = @(
    @('Seoul ESL neighborhood overview', 'Gangnam, Mapo, and northeast belt compared.', 'seoul neighborhoods esl teacher'),
    @('Daechi hagwon teacher survival', 'Subway Line 3, gyms, and parent culture.', 'daechi hagwon teacher guide'),
    @('Bundang family district guide', 'Jeongja cafes and international schools belt.', 'bundang teacher expat guide'),
    @('Suwon cost of living teachers', 'Cheaper than Seoul; Line 1 commute options.', 'suwon cost living teacher'),
    @('Yongin Giheung and Suji areas', 'Growing expat belt south of Seoul.', 'yongin giheung suji teacher'),
    @('Ilsan La Festa and Jeongbalsan', 'Western Seoul metro expat infrastructure.', 'ilsan jeongbalsan teacher guide'),
    @('Busan Haeundae beach teacher life', 'Beach lifestyle vs lower salaries.', 'haeundae busan teacher cost living'),
    @('Songdo international city ESL', 'Modern city; Incheon immigration jurisdiction.', 'songdo incheon teacher international city'),
    @('Daegu EPIK inland lifestyle', 'Lower rent; smaller foreign community.', 'daegu epik teacher lifestyle'),
    @('Jeju island teaching pros cons', 'Nature lifestyle; flight to mainland for immigration.', 'jeju teaching island pros cons'),
    @('Incheon airport corridor housing', 'Cheaper rent near airport express line.', 'incheon airport housing teacher'),
    @('Gyeonggi vs Seoul salary comparison', 'Similar pay; housing may be larger in Gyeonggi.', 'gyeonggi seoul salary housing compare'),
    @('Rural EPIK placement expectations', 'Smaller classes; isolation and Korean practice.', 'rural epik placement guide'),
    @('Itaewon vs Hongdae social life', 'Expat nightlife districts compared.', 'itaewon hongdae expat social'),
    @('Pangyo tech belt English demand', 'Premium kindergartens near tech campuses.', 'pangyo kindergarten english teacher'),
    @('Ulsan industrial city teaching', 'Smaller market; Hyundai expat community.', 'ulsan teaching english korea'),
    @('Gwangju Honam region guide', 'Fewer foreigners; cultural city experience.', 'gwangju teaching korea guide'),
    @('Chuncheon and Gangwon nature', 'EPIK placements near outdoor lifestyle.', 'chuncheon gangwon epik nature')
  )
  'Teaching' = @(
    @('First week kindergarten classroom setup', 'Routines, name tags, and visual schedules.', 'first week kindergarten classroom setup'),
    @('Parent open day presentation tips', 'PPT templates and simple Korean phrases.', 'open day parent presentation kindergarten'),
    @('Behavior management young learners', 'Redirection and positive reinforcement.', 'behavior management kindergarten korea'),
    @('Phonics programs POLY vs SLP', 'Major chain curriculum differences.', 'phonics poly slp curriculum'),
    @('Lesson planning with limited prep time', 'Reuse structures; bank warm-ups.', 'lesson planning prep time hagwon'),
    @('Assessing EFL levels K1-G6', 'Quick placement activities by age.', 'assess english level kindergarten placement'),
    @('Using flashcards and TPR effectively', 'Low-prep high-engagement techniques.', 'flashcards tpr esl kindergarten'),
    @('Report card comment writing', 'Parent-facing English expectations in chains.', 'report card comments kindergarten korea'),
    @('Substitute teacher day survival', 'No plan B folder essentials.', 'substitute teacher hagwon korea'),
    @('Summer and winter camp intensives', 'Extra pay but heavy workload weeks.', 'summer winter camp hagwon intensive')
  )
  'Emergency' = @(
    @('Emergency numbers 119 112 1339', 'Fire, police, and foreigner helpline.', 'emergency 119 112 1339 foreigner'),
    @('Seoul Global Center services', 'Free counseling, labor, and legal referral.', 'seoul global center expat help'),
    @('Lost passport embassy steps', 'Police report then embassy appointment.', 'lost passport embassy korea police'),
    @('Earthquake and typhoon alerts', 'Jeju and Busan typhoon season prep.', 'typhoon earthquake alert korea jeju'),
    @('Labor dispute hotline', 'MOEL complaints for unpaid wages.', 'labor dispute unpaid wages moel'),
    @('Discrimination reporting options', 'Document incidents; seek legal aid.', 'discrimination reporting foreigner korea'),
    @('Hospital interpreter services', 'Major hospitals offer phone interpretation.', 'hospital interpreter english korea'),
    @('Crisis lines English mental health', '24-hour counseling resources list.', 'crisis line mental health english korea')
  )
  'Culture' = @(
    @('Noraebang etiquette for coworkers', 'Company dinner follow-up singing culture.', 'noraebang etiquette coworkers company dinner'),
    @('Soju and hoesik survival guide', 'Optional participation; taxi budget home.', 'hoesik soju company dinner teacher'),
    @('Gift giving Chuseok and New Year', 'Spam sets and fruit baskets to directors.', 'chuseok new year gift director korea'),
    @('Age hierarchy seonbae hubae', 'Use titles until invited to casual speech.', 'age hierarchy seonbae hubae workplace'),
    @('Dating culture as foreign teacher', 'Privacy and workplace visibility norms.', 'dating foreign teacher korea privacy'),
    @('LGBTQ+ life in Korea overview', 'Legal and social context for expats.', 'lgbtq korea expat overview'),
    @('Temple stay weekend experience', 'Cultural program for stress relief.', 'temple stay korea weekend culture'),
    @('National holiday calendar teachers', 'Seollal and Chuseok hagwon closure varies.', 'national holiday calendar hagwon closed'),
    @('Bowing depth and when to bow', '15-degree bow to coworkers vs deeper to directors.', 'bowing etiquette depth korea'),
    @('Shoes off indoors everywhere', 'School, home, and some clinics rule.', 'shoes off indoors korea school home')
  )
  'Pets' = @(
    @('Bringing dog to Korea quarantine', 'Microchip, rabies titer, and quarantine booking.', 'dog quarantine korea import pet'),
    @('Cat import Korea requirements', 'Similar rabies rules; airline pet cabin limits.', 'cat import korea rabies airline'),
    @('Pet-friendly officetel search', 'Verify building pet policy before signing.', 'pet friendly officetel korea policy'),
    @('Vet English service Seoul', 'Expat vet clinics in Itaewon and Yongsan.', 'vet english seoul expat pet'),
    @('Pet travel leaving Korea', 'Export health certificate timeline.', 'pet export leaving korea certificate')
  )
  'Tax & Pension' = @(
    @('National pension NPS refund eligibility', 'Lump-sum refund when leaving Korea permanently.', 'nps pension refund leaving korea'),
    @('Pension refund tax treaty USA', 'US citizens report refund as taxable income.', 'pension refund tax usa treaty'),
    @('Year-end tax settlement March', 'File at tax office or via employer.', 'year end tax settlement march korea'),
    @('Freelance illegal on E-2', 'Side income risks visa cancellation.', 'freelance illegal e-2 side income'),
    @('Payslip reading Korean deductions', 'NHI, NPS, income tax line items.', 'payslip deductions nhi nps korea'),
    @('Severance tax rate foreigners', 'Flat rate withholding on departure.', 'severance tax foreigner korea'),
    @('Double taxation home country filing', 'Report Korean income at home if required.', 'double taxation home country korea income')
  )
  'Phones & Utilities' = @(
    @('Korean phone plan comparison', 'LG U+ vs SK vs KT prepaid and postpaid.', 'phone plan korea lg sk kt'),
    @('Alien registration for phone contract', 'ARC required for standard postpaid plans.', 'phone contract arc alien registration'),
    @('Internet VPN legality Korea', 'Personal VPN use gray area; work compliance.', 'vpn korea legality teacher'),
    @('Electricity bill summer spike', 'AC usage monitoring apps from KEPCO.', 'electricity bill summer ac kepco'),
    @('Gas bill ondol winter', 'Expect 2-3x summer gas charges.', 'gas bill ondol winter cost'),
    @('Water and maintenance billing', 'Bundled in gwanbi monthly statement.', 'water maintenance fee gwanbi bill')
  )
}

$priorityTitles = @{
  'How to book a HiKorea appointment' = 'cal'
  'Find your local immigration office' = 'bldg'
  'E-2 visa document checklist 2026' = 'doc'
  'ARC application first week in Korea' = 'card'
  'Open a Korean bank account guide' = 'bank'
  'National Health Insurance enrollment' = 'health'
  'Contract red flags before signing' = 'warn'
  'Address change registration' = 'pin'
  'Re-entry permit single vs multiple' = 'plane'
  'Find Your Immigration Office' = 'map'
}

$lines = New-Object System.Collections.Generic.List[string]
$lines.Add('// AUTO-GENERATED SUPPORT GUIDE CATALOG')
$id = 1
$all = @()

foreach ($cat in $categories.Keys) {
  foreach ($item in $categories[$cat]) {
    $title = $item[0] -replace "'", "\'"
    $summary = $item[1] -replace "'", "\'"
    $kw = $item[2] -replace "'", "\'"
    $isPriority = $priorityTitles.ContainsKey($item[0])
    $icon = if ($isPriority) { $priorityTitles[$item[0]] } else { '' }
    $all += [pscustomobject]@{ id=$id; cat=$cat; title=$title; summary=$summary; kw=$kw; priority=$isPriority; icon=$icon }
    $id++
  }
}

# Add immigration finder as priority #10 if not duplicate
$finder = [pscustomobject]@{
  id=$id; cat='Immigration'; title='Find Your Immigration Office'; summary='Select your city to see typical immigration branch assignments before visiting.'
  kw='immigration office finder seoul busan gyeonggi'; priority=$true; icon='map'
}
$all += $finder

Write-Host "Total guides: $($all.Count)"

$json = ($all | ConvertTo-Json -Compress -Depth 5)
$out = "c:\Users\moomo\OneDrive\Desktop\New folder\_support-guides.json"
$all | ConvertTo-Json -Depth 5 | Set-Content -Encoding UTF8 $out
Write-Host "Written $out"

$jsPath = "c:\Users\moomo\OneDrive\Desktop\New folder\support-guides.js"
$js = 'const SUPPORT_GUIDES = ' + ($all | ConvertTo-Json -Compress -Depth 6) + ';'
[System.IO.File]::WriteAllText($jsPath, $js, [System.Text.UTF8Encoding]::new($false))
Write-Host "Written $jsPath length $($js.Length)"
