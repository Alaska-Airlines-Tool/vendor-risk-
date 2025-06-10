// Full vendor risk tool with all question logic, correct scoring, and Google Sheet integration

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("risk-form");
  const container = document.getElementById("questions-container");

  const functionWeights = {
    "Flight Operations": [0.4, 0.15, 0.25, 0.1, 0.05, 0.05],
    "Aircraft Maintenance & Engineering": [0.4, 0.15, 0.25, 0.1, 0.05, 0.05],
    "Ground Operations & Airport Services": [0.4, 0.15, 0.25, 0.1, 0.05, 0.05],
    "IT & Technology": [0.4, 0.15, 0.25, 0.1, 0.05, 0.05],
    "Customer Service & Guest Products": [0.4, 0.15, 0.25, 0.1, 0.05, 0.05],
    "Procurement & Supply Chain": [0.4, 0.15, 0.25, 0.1, 0.05, 0.05],
    "Corporate & Finance": [0.4, 0.15, 0.25, 0.1, 0.05, 0.05],
    "Safety, Security, & Risk": []
  };

  const riskAreas = [
    {
      title: "Safety Risk",
      impact: [
        "Would a failure, delay, or quality issue with this vendor's product or service introduce risk to passenger, crew, or employee safety?",
        "Is the vendor essential to maintaining the safety, reliability, or regulatory airworthiness of operational assets (e.g., aircraft, ground support equipment, systems)?",
        "Does the vendor provide systems, services, or personnel that directly support safety-critical training, certification, or operational readiness (e.g. aircraft pushback, towing, and marshalling, de-icing/anti-icing operations, fueling and fuel quantity validation, weight and balance/load planning, emergency response coordination on the ground)?",
        "Does this vendor provide services, technology, or content that supports training, certification, or procedural readiness for operational teams (e.g., pilots, technicians, ground staff)?",
        "Does this vendor produce, deliver, install, or maintain components, systems, or tools that are critical to aircraft safety, emergency response, or regulatory requirements?",
        "Does this vendor handle specialized work on systems (e.g. teardown, overhaul, diagnostics) or components whose failure could directly impact in-flight performance, propulsion, or safety operations?"
      ],
 likelihood: [
  "In the recent past,, how often has this vendor been associated with safety incidents, warnings, or audit findings affecting passenger or crew crew, or operational employees (e.g., ramp agents, fuelers, dispatchers)?\n1 = Never\n2 = One minor, contained incident\n3 = One moderate or multiple minor issues\n4 = Recurring moderate issues or one serious finding\n5 = Multiple serious or systemic safety incidents (Recent past – 3–4 years)",

  "How limited are Alaska’s alternative vendor options for this safety-critical service (e.g., aircraft maintenance, inspection, de-icing)?\n1 = Multiple qualified backups ready\n2 = 1–2 reliable backups, already vetted\n3 = Only one partially-vetted backup\n4 = No approved backup currently in place\n5 = No alternatives exist; replacement would cause operational disruption",

  "How robust is the vendor’s disaster recovery or continuity plan for supporting critical operational safety functions (e.g., aircraft marshalling, pushback/tow operations, fueling, de-icing, emergency coordination)?\n1 = Fully documented, tested within last 12 months\n2 = Documented and tested within last 24 months\n3 = Documented but not recently tested\n4 = Incomplete or outdated plan\n5 = No plan exists or cannot be provided",

  "How prepared is Alaska to switch to a backup vendor for this safety-related function?\n1 = Backup vendor fully approved and tested recently\n2 = Backup vendor in place but not tested recently\n3 = Backup plan exists, but vendor not fully approved\n4 = No backup vendor currently active\n5 = No backup exists; switch would be disruptive",

  "In the recent past, has the backup vendor for this serivce critical to aircraft safety, emergency response, or regulatory requirements been tested or used, and how reliable was the result?\n1 = Tested and fully successful\n2 = Tested with minor issues corrected\n3 = Test showed gaps, but mitigations underway\n4 = Test failed, not retested yet\n5 = Test failed, no follow-up or backup readiness unknown",

  "If this vendor’s  in-flight performance, propulsion, or safety operations service fails, how easily can Alaska continue operations using internal or temporary alternatives?\n1 = Fully replaceable or temporary workaround exists\n2 = Minor operational impact; workaround possible\n3 = Moderate disruption, partial workaround available\n4 = Major disruption, only limited workaround possible\\n5 = No workaround available; operations would halt or pose safety risk"
]


    },
    {
      title: "Compliance Risk",
      impact: [
        "Does this vendor support or operate within systems, processes, or workflows that are subject to federal, state, or international regulatory compliance (e.g., FAA, DOT, TSA, SEC, ITAR, GDPR)?",
        "Is the vendor based in, operating from, or transacting with regions subject to government-imposed export controls, trade sanctions, or geopolitical restrictions?",
        "Is this vendor required to meet Alaska Airlines’ internal compliance policies, including mandatory safety, security, training, or ethics programs for regulated roles or tasks?",
        "Could a failure, error, or policy breach by this vendor result in legal exposure, regulatory penalties, or reputational damage to Alaska Airlines?",
        "Does this vendor manage or maintain critical operational records, certifications, or compliance data required by law or oversight agencies?"
      ],
     likelihood: [
  "In the recent past, how compliant has this vendor been with federal, state, or international regulatory compliance (e.g., FAA, DOT, TSA, SEC, ITAR, GDPR?\n1 = Fully compliant, no issues\n2 = Minor documentation errors, resolved\n3 = Moderate issues or late submissions\n4 = Ongoing gaps or repeat non-compliance\n5 = Serious or systemic violations noted by FAA or others",

  "In the recent past, has the vendor violated or been flagged for risks related to government-imposed export controls, trade sanctions, or geopolitical restrictions?\n1 = No violations, clear record\n2 = One low-risk issue resolved\n3 = One moderate issue, under review\n4 = Repeated or unresolved violations\n5 = Active restrictions or sanctions impacting operations",

  "How effectively does the vendor document and monitor employee compliance with Alaska Airlines’ required training, including mandatory safety, security, training, or ethics programs for regulated roles or tasks?\n1 = All records complete and up to date\n2 = One-time lapse or delay, quickly fixed\n3 = Occasional gaps or outdated records\n4 = Regularly incomplete documentation or poor monitoring\n5 = No documentation or system for compliance training",

  "In the recent past, has this vendor faced any legal exposure, regulatory penalties, or reputational damage incidents that could affect Alaska’s regulatory standing or reputation?\n1 = No known issues or disputes\n2 = One minor incident, resolved\n3 = Moderate issue with some external attention\n4 = Ongoing issue or multiple incidents\n5 = Major legal/regulatory issue impacting reputation or contracts",

  "In the recent past, how reliable has this vendor been in managing critical operational records, certifications, or compliance data required by law or oversight agencies?\n1 = No errors, complete and timely records\n2 = One minor delay or gap, resolved\n3 = Moderate errors or incomplete tracking\n4 = Repeated errors or audit flags\n5 = Serious lapses, failed audits, or regulatory risk"
]

    },
    {
      title: "Operational Risk",
      impact: [
        "Does the vendor provide services, systems, or products that directly impact operational logistics or turnaround performance?",
        "Does the vendor deliver critical infrastructure or services supporting fueling, weight and balance, or aircraft readiness?",
        "Does the vendor support the movement, handling, or tracking of passenger, crew, cargo, or baggage assets?",
        "Does the vendor impact crew, dispatch, or scheduling systems that influence real-time or pre-flight planning?",
        "Does the vendor provide data, tools, or systems relevant to operational decision-making (e.g., weather, routing, NOTAMs, or dispatch)?",
        "Would a failure or delay from this vendor directly impact the safe operation, dispatch readiness, or regulatory compliance of crews?"
      ],
     likelihood: [
  "In the recent past, how often has this vendor caused operational delays or breakdowns that directly impact operational logistics or turnaround performance?\n1 = Never\n2 = One isolated incident, resolved\n3 = Occasional minor issues\n4 = Recurring delays or coordination problems\n5 = Frequent or serious disruptions impacting flights",

  "How often in the recent past has this vendor experienced fueling delays, incorrect fuel quantity, or weight and balance failures that affected aircraft readiness or on-time departure?\n1 = Never\n2 = One minor issue, resolved quickly\n3 = Occasional moderate delays\n4 = Several incidents, with flight impact\n5 = Frequent or serious fueling-related failures",

  "In the recent past, has the vendor been involved in errors related to movement, handling, or tracking of passenger, crew, cargo, or baggage assets that affected flight schedules or passenger satisfaction?\n1 = No incidents\n2 = One minor case\n3 = 2–3 issues with limited impact\n4 = Recurring baggage handling problems\n5 = Frequent or serious errors impacting flights or customers",

  "In the recent past, how often has this vendor caused disruptions to dispatch workflows, crew scheduling, or readiness that affected real-time or pre-flight arrival or departures?\n1 = Never\n2 = One isolated issue, resolved quickly\n3 = Moderate issues on occasion\n4 = Repeat coordination or tech problems\n5 = Frequent or critical delays linked to vendor services",

  "In the recent past, how often has the vendor’s system experienced unplanned downtime, delayed weather data, or NOTAM errors affecting dispatch or flight decisions?\n1 = Never\n2 = One minor delay or error\n3 = A few cases with limited impact\n4 = Recurring delays or data delivery issues\n5 = Frequent or serious problems affecting flight safety or timing",

  "In the recent past, how reliably has this vendor delivered accurate load planning, weight & balance documents, or cargo coordination for safe operation, dispatch readiness, or regulatory compliance of crews?\n1 = Always accurate, no issues\n2 = One minor documentation error\n3 = A few moderate gaps found\n4 = Repeated errors requiring re-checks or delays\n5 = Serious failures causing aircraft reassignment or flight impact"
]

    },
    {
      title: "IT & Cyber Risk",
      impact: [
        "Is this vendor responsible for delivering or supporting digital platforms, applications, or interfaces used by operational teams (e.g., flight crew, maintenance, or ground staff)?",
        "Does this vendor provide, host, or manage operational systems essential to flight planning, monitoring, dispatch, or real-time performance tracking?",
        "Would a disruption in this vendor’s system result in the loss or corruption of critical operational data such as crew schedules, cargo logs, maintenance timelines, or passenger manifests?",
        "Is this vendor responsible for any customer-facing digital experiences (e.g., booking platforms, check-in tools, mobile apps, or systems handling personal identifiable information)?",
        "Would a failure in this vendor’s systems compromise the timely delivery of required data to regulatory bodies, internal oversight teams, or compliance systems?"
      ],
    likelihood: [
  "In the recent past, how often has this vendor’s platforms for operational teams (e.g., flight crew, maintenance, or ground staff) experienced downtime, data sync issues, or usability problems affecting pilot operations or readiness?\n1 = Never\n2 = One isolated issue, resolved quickly\n3 = A few minor disruptions, no major impact\n4 = Recurring performance issues impacting readiness\n5 = Frequent outages or serious usability failures",

  "How often has this vendor experienced system failures, data feed errors, or outages in the recent past that disrupted flight planning, monitoring, dispatch, or real-time performance tracking?\n1 = Never\n2 = One minor disruption, resolved fast\n3 = Occasional moderate issues\n4 = Multiple disruptions with some operational effect\n5 = Frequent or serious failures impacting operations",

  "In the recent past, how many incidents has this vendor had involving in loss or corruption of critical operational data such as crew schedules, cargo logs, maintenance timelines, or passenger manifests?\n1 = None\n2 = One minor issue with no lasting impact\n3 = Occasional issues with recoverable loss\n4 = Repeat problems requiring manual recovery\n5 = Major or unrecoverable loss incidents",

  "Has this vendor’s system caused any high-visibility outages, performance delays, or customer-facing issues in the recent past (e.g., website crashes, failed mobile check-ins)?\n1 = No incidents\n2 = One minor delay or outage\n3 = Occasional, resolved quickly\n4 = Multiple public-facing issues\n5 = Frequent or major failures with public impact",

  "How reliably has this vendor delivered accurate and timely data to regulatory bodies, internal oversight teams, or compliance systems in the past year?\n1 = Always timely and accurate\n2 = One minor delay, no impact\n3 = Occasional delays or formatting issues\n4 = Multiple delays or data inconsistencies\n5 = Consistent failure to meet compliance data needs"
]

    },
    {
      title: "Financial Risk",
      impact: [
        "Would switching or replacing this vendor result in significant financial penalties, transition delays, retraining costs, or operational disruption?",
        "Is this vendor engaged under a high-value contract or long-term strategic agreement with material financial exposure (e.g., _______ annual value)?",
        "Does this vendor support systems, platforms, or services that are critical to revenue generation or core business continuity?",
        "Would a failure or service outage from this vendor cause a measurable impact on Alaska’s revenue, customer transactions, or digital sales performance?",
        "Is this vendor responsible for sourcing, delivering, or financing high-value capital assets such as aircraft, engines, or specialized infrastructure?"
      ],
     likelihood: [
  "In the recent past, how often has Alaska incurred penalties, onboarding delays, or retraining costs when switching vendors in this service category?\n1 = No history of issues\n2 = One minor case, handled well\n3 = Moderate cost or effort in transition\n4 = Repeated transition issues or penalties\n5 = Severe or costly failures in switching vendors",

  "How prone is this vendor’s pricing model to cost uncertainty, lack of transparency, or budget overruns?\n1 = Fully fixed-rate and transparent\n2 = Mostly fixed, rare adjustments\n3 = Some variability and unclear terms\n4 = Frequently exceeds budgeted amounts\n5 = Highly unpredictable, opaque pricing",

  "In the recent past, has this vendor caused any system platforms, services outages or integration failures in profit-generating systems (e.g., booking, payments) or core business continuity?\n1 = No incidents\n2 = One minor, resolved fast\n3 = A few issues, limited impact\n4 = Multiple disruptions with financial impact\n5 = Frequent or severe failures affecting revenue flow",

  "In the recent past, has this vendor caused a measurable impact on Alaska’s revenue, customer transactions, or digital sales performance?\n1 = No effect on profit\n2 = One-time impact, resolved\n3 = Occasional small impacts\n4 = Repeated or moderate profit loss\n5 = Clear and significant profit loss caused by vendor failure",

  "In the recent past, has this vendor missed project deadlines, exceeded budgets, or failed to meet milestones for large capital projects (e.g., aircraft, engines, or specialized infrastructure)?\n1 = Delivered on time and on budget\n2 = Minor delay or overage\n3 = Several manageable delays or cost issues\n4 = Missed key milestones, over budget\n5 = Major failure causing project delays or overspending"
]

    },
    {
      title: "Competitive Risk",
      impact: [
        "Does this vendor possess proprietary technology, patents, certifications, or system integrations that would be difficult or impossible to replace within 90 days?",
        "Would discontinuing this vendor affect eligibility or compliance with critical strategic partnerships, industry certifications, or contractual obligations with third parties?",
        "Is this vendor one of the few (or only) providers globally capable of delivering the required product, service, or system at scale or quality standards needed by Alaska Airlines?",
        "Would the vendor’s sudden exit or disruption materially impact Alaska’s leverage in future negotiations or result in significant switching costs or operational delays?"
      ],
      likelihood: [
  "In the recent past, how often has this vendor delayed or restricted access to proprietary technology, patents, certifications, or system integrations?\n1 = Always provides full, timely access\n2 = One minor delay, resolved quickly\n3 = Occasional slow response or missing info\n4 = Recurring access issues or delays\n5 = Frequently withholds or controls access, blocking transitions",

  "Is this vendor tied to critical strategic partnerships, industry certifications, or contractual obligations with third parties such that switching vendors would require renegotiation or regulatory review?\n1 = No such dependencies or contracts\n2 = Low dependency; minimal renegotiation needed\n3 = Medium-level risk; some formal review required\n4 = High complexity or delayed approvals likely\n5 = Replacement would disrupt key contracts or alliances",

  "In the recent past, has this vendor retained market dominance despite emerging competitors or alternative solutions?\n1 = Not a dominant player; many strong alternatives exist\n2 = Slightly preferred but not critical\n3 = Maintains a moderate market edge\n4 = Few real competitors; difficult to challenge\n5 = Clear monopoly or dominance, no effective alternatives",

  "In recent negotiations, has this vendor raised prices unilaterally, rejected flexibility, or limited renewal terms in a way that reduces Alaska’s leverage?\n1 = Fully flexible and fair terms\n2 = Minor pricing pressure or negotiation required\n3 = Some rigidity in contract or renewal conditions\n4 = Significant inflexibility or unilateral pricing\n5 = No room for negotiation; vendor controls all terms"
]

    }
  ];

  function createRadioGroup(name, index) {
    const div = document.createElement("div");
    div.className = "radio-group";
    div.innerHTML = `
      <label><input type="radio" name="${name}-${index}" value="yes" required> Yes</label>
      <label><input type="radio" name="${name}-${index}" value="no"> No</label>
    `;
    return div;
  }

function createSelectGroup(name, index) {
  const wrapper = document.createElement("div");
  wrapper.className = "likert-scale"; // Already styled to be row

  for (let i = 1; i <= 5; i++) {
    const label = document.createElement("label");
    label.className = "likert-option";

    const input = document.createElement("input");
    input.type = "radio";
    input.name = `${name}-${index}`;
    input.value = i;
    input.required = true;

    label.appendChild(input);
    wrapper.appendChild(label); // Removed textNode(i), we style via ::before
  }

  return wrapper;
}



  riskAreas.forEach((area) => {
    const section = document.createElement("section");
    section.innerHTML = `
      <h2>${area.title}</h2>
      <div class="question-headers">
        <strong>Impact Questions (Yes/No)</strong>
        <strong>Likelihood Questions (1–5)</strong>
      </div>
    `;

    const rows = document.createElement("div");
    rows.className = "question-row-container";

    for (let i = 0; i < Math.max(area.impact.length, area.likelihood.length); i++) {
      const row = document.createElement("div");
      row.className = "question-row";

      const impactWrapper = document.createElement("div");
      impactWrapper.className = "question-box";
      if (area.impact[i]) {
        impactWrapper.innerHTML = `<label>${i + 1}. ${area.impact[i]}</label>`;
        impactWrapper.appendChild(createRadioGroup(area.title + "-impact", i));
      }

      const likelihoodWrapper = document.createElement("div");
      likelihoodWrapper.className = "question-box";
      if (area.likelihood[i]) {
        likelihoodWrapper.innerHTML = `<label class="likelihood-label">${i + 1}. ${area.likelihood[i].replace(/\n/g, "<br>")}</label>`;
        likelihoodWrapper.appendChild(createSelectGroup(area.title + "-likelihood", i));
      }

      row.appendChild(impactWrapper);
      row.appendChild(likelihoodWrapper);
      rows.appendChild(row);
    }

    section.appendChild(rows);
    container.appendChild(section);
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const selectedFunction = document.getElementById("function-select").value;
    const weights = functionWeights[selectedFunction];

    let totalImpactScore = 0;
    let totalLikelihoodScore = 0;

    riskAreas.forEach((area, i) => {
      let impactYesCount = 0;
      let likelihoodSum = 0;

      for (let j = 0; j < area.impact.length; j++) {
        const impactAnswer = document.querySelector(`input[name='${area.title}-impact-${j}']:checked`);
        if (impactAnswer && impactAnswer.value === "yes") impactYesCount++;
      }

     for (let j = 0; j < area.likelihood.length; j++) {
  const likelihoodAnswer = document.querySelector(`input[name='${area.title}-likelihood-${j}']:checked`);
  if (likelihoodAnswer) likelihoodSum += parseInt(likelihoodAnswer.value);
}


      const impactPercent = impactYesCount / area.impact.length;
      const likelihoodAvg = likelihoodSum / area.likelihood.length / 5;

      totalImpactScore += impactPercent * 5 * weights[i];
      totalLikelihoodScore += likelihoodAvg * 5 * weights[i];
    });

   const riskScore = (totalImpactScore * 0.6) + (totalLikelihoodScore * 0.4);
const riskPercent = (riskScore / 5) * 100;

let criticality = "🟢 Low Risk";
if (riskPercent >= 75) criticality = "🔴 Critical";
else if (riskPercent >= 45) criticality = "🟠 Semi-Critical";


    const vendorName = document.getElementById("vendor-name").value;
    document.getElementById("result").innerHTML = `
      <h3>Results for: ${vendorName}</h3>
      <p><strong>Impact Score:</strong> ${totalImpactScore.toFixed(2)}</p>
      <p><strong>Likelihood Score:</strong> ${totalLikelihoodScore.toFixed(2)}</p>
      <p><strong>Risk Score:</strong> ${riskScore.toFixed(2)}</p>
      <p><strong>Risk Score %:</strong> ${riskPercent.toFixed(1)}%</p>
      <p><strong>Vendor Criticality:</strong> ${criticality}</p>
    `;

    const payload = {
    
      functionCategory: selectedFunction,
      impactScore: totalImpactScore.toFixed(2),
      likelihoodScore: totalLikelihoodScore.toFixed(2),
      riskScore: riskScore.toFixed(2),
      riskPercent: riskPercent.toFixed(1),
      criticality
    };
console.log("Sending payload:", payload);
const formData = new FormData();
formData.append("Vendor Name", vendorName);
formData.append("Function Category", selectedFunction);
formData.append("Impact Score", totalImpactScore.toFixed(2));
formData.append("Likelihood Score", totalLikelihoodScore.toFixed(2));
formData.append("Risk Score", riskScore.toFixed(2));
formData.append("Risk %", riskPercent.toFixed(1));
formData.append("Vendor-Criticality", criticality);

fetch("https://formspree.io/f/mgvyerog", {
  method: "POST",
  body: formData
})
.then(() => console.log("Submitted to Formspree"))
.catch(err => console.error("Submit error:", err));

  });
});