import { 
  PieChart, Cpu, Share2, Search, Banknote, 
  FileText, Headphones, UserMinus, Settings, UserCheck, 
  LucideIcon 
} from "lucide-react";

export interface ServiceSectionItem {
  title: string;
  description: string;
}

export interface ServiceDetail {
  id: string;
  title: string;
  icon: LucideIcon;
  color: string;
  shortDescription: string;
  
  // Content Sections
  introText: string[]; 
  detailedServices: ServiceSectionItem[]; 
  coreServices: ServiceSectionItem[]; 
  benefitsDetail: ServiceSectionItem[]; 
  whyChooseUs: ServiceSectionItem[]; 
  workProcess: ServiceSectionItem[]; 
  otherServices: string[]; 
}

export const servicesData: ServiceDetail[] = [
  { 
    id: "service1", 
    title: "Finance Consulting", 
    icon: PieChart, 
    color: "#0AA8A3",
    shortDescription: "Expert guidance to reduce costs, boost profitability, and navigate complex financial landscapes.",
    
    introText: [
      "As a business owner, managing your finances effectively is crucial to the success of your organization. Finance consulting is a vital aspect of business management that helps companies make informed decisions, reduce costs, and increase profitability.",
      "At our finance consulting firm, we provide expert guidance and support to help businesses navigate the complex world of finance. Our team of experienced professionals offers a wide range of finance consulting services designed to help you achieve your financial goals."
    ],

    detailedServices: [
      {
        title: "Virtual Executive Assistant Services",
        description: "Our virtual executive assistant services provide businesses with the support they need to manage their finances effectively. Our team of experienced virtual assistants can help with tasks such as financial data entry, invoicing, and expense tracking."
      },
      {
        title: "Book-Keeping Services",
        description: "Our book-keeping services help businesses keep track of their financial transactions accurately. Our team of experienced book-keepers can help with tasks such as financial statement preparation, budgeting, and financial analysis."
      },
      {
        title: "Back Office Automations",
        description: "Our back office automation services help businesses streamline their financial processes and reduce costs. Our team of experienced professionals can help automate tasks such as accounts payable, accounts receivable, and payroll processing."
      },
      {
        title: "Functional Outsourcing",
        description: "Our functional outsourcing services provide businesses with the expertise they need to manage their finances effectively. Our team of experienced professionals can help with tasks such as financial planning, budgeting, and financial analysis."
      },
      {
        title: "Mystery Audits",
        description: "Our mystery audit services help businesses identify areas of improvement in their financial processes. Our team of experienced auditors can conduct discrete audits to identify areas of risk and provide recommendations for improvement."
      },
      {
        title: "Payroll Management",
        description: "Our payroll management services help businesses manage their payroll processes effectively. Our team of experienced professionals can help with tasks such as payroll processing, tax compliance, and benefits administration."
      },
      {
        title: "Accounts Payable",
        description: "Our accounts payable services help businesses manage their accounts payable processes effectively. Our team of experienced professionals can help with tasks such as invoice processing, payment processing, and vendor management."
      },
      {
        title: "Collection Accounting & Debtors",
        description: "Our collection accounting and debtors services help businesses manage their accounts receivable processes effectively. Our team of experienced professionals can help with tasks such as invoicing, payment processing, and debt collection."
      },
      {
        title: "Bank Reconciliations",
        description: "Our bank reconciliation services help businesses manage their cash flow effectively. Our team of experienced professionals can help with tasks such as bank statement reconciliation, account reconciliation, and cash flow management."
      },
      {
        title: "Fixed Assets Verification & Tagging",
        description: "Our fixed assets verification and tagging services help businesses manage their fixed assets effectively. Our team of experienced professionals can help with tasks such as asset verification, asset tagging, and asset tracking."
      },
      {
        title: "Cost Audit & Gap Analysis",
        description: "Our cost audit and gap analysis services help businesses identify areas of cost savings. Our team of experienced professionals can conduct a thorough analysis of your business's costs and provide recommendations for cost reduction."
      },
      {
        title: "Internal Audit & IFC",
        description: "Our internal audit and IFC services help businesses ensure compliance with regulatory requirements. Our team of experienced auditors can conduct internal audits to identify areas of risk and provide recommendations for improvement."
      },
      {
        title: "PROCESS REVIEWS",
        description: "Our process review services help businesses identify areas of improvement in their financial processes. Our team of experienced professionals can conduct a thorough review of your business's financial processes and provide recommendations for improvement."
      },
      {
        title: "Management & Financial Reporting",
        description: "Comprehensive reporting services to give you clear visibility into your financial health."
      },
      {
        title: "Audit Readiness",
        description: "Prepare your business for external audits with organized, compliant records."
      },
      {
        title: "Physical Stock Verification",
        description: "Accurate verification of physical inventory against records."
      },
      {
        title: "Inventory Cycle Count",
        description: "Regular inventory counting to maintain stock accuracy."
      },
      {
        title: "Transition Audits",
        description: "Audits designed to smooth the transition during mergers or restructuring."
      },
      {
        title: "CSR Review & Support Function",
        description: "Reviewing Corporate Social Responsibility initiatives and support functions."
      }
    ],

    coreServices: [
      {
        title: "Financial Accounting and Reporting",
        description: "We handle all aspects of your financial accounting, from general bookkeeping to preparing financial reports. Our solutions are designed to ensure compliance with all applicable regulations while optimizing your financial processes."
      },
      {
        title: "Payroll Management",
        description: "Managing payroll can be complex, especially for businesses operating across multiple jurisdictions. We offer comprehensive payroll services, ensuring timely and accurate payments while maintaining compliance with local labor laws."
      },
      {
        title: "Tax Advisory and Compliance",
        description: "Taxation can be a major challenge for businesses, especially as regulations continue to evolve. Our tax advisory services ensure that your business stays compliant, while also helping you identify tax-saving opportunities."
      },
      {
        title: "Business Process Outsourcing (BPO)",
        description: "Our BPO services include the outsourcing of various finance functions like accounts payable, audit readiness, cash applications, and financial reporting. We help businesses improve operational efficiency while reducing costs."
      }
    ],

    benefitsDetail: [
      {
        title: "Improved Financial Efficiency",
        description: "Our finance consulting services can help businesses improve their financial efficiency by streamlining financial processes, reducing costs, and increasing profitability."
      },
      {
        title: "Enhanced Decision-Making",
        description: "Our finance consulting services can help businesses make informed decisions by providing accurate and timely financial information."
      },
      {
        title: "Increased Transparency",
        description: "Our finance consulting services can help businesses increase transparency by providing clear and concise financial reporting."
      },
      {
        title: "Risk Management",
        description: "Our finance consulting services can help businesses manage risk by identifying areas of risk and providing recommendations for improvement."
      },
      {
        title: "Compliance",
        description: "Our finance consulting services can help businesses ensure compliance with regulatory requirements by conducting audits and providing recommendations for improvement."
      }
    ],

    whyChooseUs: [
      {
        title: "Expertise",
        description: "Our team of experienced professionals has a deep understanding of finance and business operations."
      },
      {
        title: "Personalized Approach",
        description: "We take a personalized approach to finance consulting, working closely with each client to understand their unique needs and goals."
      },
      {
        title: "Proven Track Record",
        description: "We have a proven track record of helping businesses achieve their financial goals."
      },
      {
        title: "Cost-Effective Solutions",
        description: "We provide cost-effective solutions that help businesses reduce costs and increase profitability."
      }
    ],

    workProcess: [
      {
        title: "Initial Consultation",
        description: "Understand your business needs and financial goals."
      },
      {
        title: "Custom Service Proposal",
        description: "Develop a bespoke service plan that aligns with your objectives."
      },
      {
        title: "Implementation",
        description: "Execute the agreed services with precision and professionalism."
      },
      {
        title: "Ongoing Support",
        description: "Provide continuous support and adjustments as your business evolves."
      }
    ],

    otherServices: [
      "Back office Automation Service",
      "Functional Outsourcing",
      "Mystery Audits",
      "Payroll Management",
      "Bookkeeping Services",
      "Virtual Assistant Services",
      "Attrition Management",
      "Process Outsourcing",
      "Manpower Outsourcing"
    ]
  },
  { 
    id: "service2", 
    title: "Back Office Automation", 
    icon: Cpu, 
    color: "#0F172A", 
    shortDescription: "Streamline operations using AI & RPA to automate repetitive tasks and focus on innovation.",
    
    introText: [
      "In today’s fast-paced business environment, efficiency is key. Companies that can streamline their operations and reduce manual tasks are better positioned to succeed. This is where back office automation comes into play. By automating repetitive and time-consuming tasks, businesses can focus on what truly matters—innovation and growth.",
      "Back office automation refers to the use of technology to automate various administrative and operational tasks within a business. These tasks often include data entry, invoice processing, HR management, and more. By leveraging automation tools and software, businesses can significantly reduce the time and effort required to complete these tasks, leading to increased efficiency and productivity.",
      "In modern businesses, the back office is the backbone of operations. It handles everything from payroll to customer data management. However, these tasks can be tedious and prone to errors if done manually. Back office automation transforms these processes by integrating advanced technologies such as AI, machine learning, and robotic process automation (RPA). This not only speeds up operations but also ensures accuracy and consistency."
    ],

    detailedServices: [
      {
        title: "Data Entry and Management",
        description: "Our data entry and management services use advanced software to automate the input and processing of large volumes of data. This ensures that your data is accurate, up-to-date, and easily accessible."
      },
      {
        title: "Invoice Processing and Accounts Payable",
        description: "Automating invoice processing and accounts payable reduces the time and effort required to manage financial transactions. Our systems can handle everything from invoice receipt to payment, ensuring that your financial records are always accurate and compliant."
      },
      {
        title: "Human Resources and Payroll Management",
        description: "Managing HR and payroll can be a complex and time-consuming task. Our automation services streamline these processes, from employee onboarding to payroll processing, ensuring that your HR department operates efficiently and effectively."
      },
      {
        title: "Customer Relationship Management (CRM)",
        description: "A robust CRM system is essential for managing customer interactions and data. Our automation services integrate with your CRM to automate tasks such as lead tracking, customer follow-up, and data analysis, helping you build stronger relationships with your customers."
      },
      {
        title: "Inventory and Supply Chain Management",
        description: "Effective inventory and supply chain management is crucial for maintaining product availability and reducing costs. Our automation solutions help you track inventory levels, manage supplier relationships, and optimize your supply chain operations."
      }
    ],

    coreServices: [
      {
        title: "Administrative Automation",
        description: "We utilize technology to automate critical administrative tasks such as data entry and document handling, significantly reducing manual effort."
      },
      {
        title: "AI & Machine Learning",
        description: "We integrate advanced AI and machine learning to enable intelligent decision-making and predictive analytics within your back office operations."
      },
      {
        title: "Robotic Process Automation (RPA)",
        description: "Our RPA solutions handle high-volume, repetitive tasks with zero error rates, ensuring your operations run smoothly around the clock."
      },
      {
        title: "Seamless Integration",
        description: "Our tools integrate seamlessly with your existing CRM and ERP systems, creating a unified ecosystem for your business data."
      }
    ],

    benefitsDetail: [
      {
        title: "Increased Efficiency and Productivity",
        description: "Automated systems can handle tasks much faster than humans, allowing your team to focus on more strategic activities. For instance, automated data entry can process thousands of records in minutes."
      },
      {
        title: "Cost Reduction",
        description: "By reducing the need for manual labor, businesses can lower their operational costs. Additionally, automated systems are often more reliable and require less maintenance, further reducing expenses over time."
      },
      {
        title: "Enhanced Accuracy and Data Integrity",
        description: "Manual processes are prone to errors, which can be costly. Back office automation minimizes these errors by ensuring that tasks are performed consistently and accurately, leading to better data integrity."
      },
      {
        title: "Scalability and Flexibility",
        description: "Automation provides the scalability required to handle increased workloads without a proportional increase in resources. Whether expanding into new markets or handling seasonal spikes, automated systems adapt to your needs."
      },
      {
        title: "Enhanced Customer Experience",
        description: "With automation, businesses can respond to customer inquiries and requests more quickly, leading to improved customer satisfaction."
      }
    ],

    whyChooseUs: [
      {
        title: "Expertise and Experience",
        description: "With years of experience in the field, our team of experts has the knowledge and skills to deliver top-notch back office automation services."
      },
      {
        title: "Customized Solutions",
        description: "We understand the unique challenges faced by businesses and tailor our solutions to meet your specific needs."
      },
      {
        title: "Advanced Technology Integration",
        description: "We leverage the latest in AI, Machine Learning, and RPA to ensure your business stays ahead of the curve."
      },
      {
        title: "24/7 Support and Monitoring",
        description: "Our team will continue to monitor and maintain your automation tools, ensuring that they continue to run smoothly and efficiently around the clock."
      }
    ],

    workProcess: [
      {
        title: "Consultation",
        description: "We’ll work with you to understand your business needs and identify areas where automation can have the greatest impact."
      },
      {
        title: "Implementation",
        description: "Our team will implement the necessary automation tools and software to streamline your back office operations."
      },
      {
        title: "Training and Support",
        description: "We’ll provide comprehensive training and support to ensure that your staff is comfortable using the new automation tools."
      },
      {
        title: "Ongoing Maintenance",
        description: "Our team will continue to monitor and maintain your automation tools, ensuring that they continue to run smoothly and efficiently."
      }
    ],

    otherServices: [
      "Finance Consulting",
      "Functional Outsourcing",
      "Mystery Audits",
      "Payroll Management",
      "Bookkeeping Services",
      "Virtual Assistant Services",
      "Attrition Management",
      "Process Outsourcing",
      "Manpower Outsourcing"
    ]
  },
  { 
    id: "service3", 
    title: "Functional Outsourcing", 
    icon: Share2, 
    color: "#0AA8A3", 
    shortDescription: "Delegate specific functions like HR and Accounts Payable to specialized experts to improve efficiency and reduce costs.",
    
    introText: [
      "We understand the challenges of managing multiple functions within an organization. That’s why we offer functional outsourcing services to help you free up resources and focus on what matters most. Functional outsourcing involves delegating specific business functions to external providers, allowing you to tap into specialized expertise and reduce costs.",
      "This can include HR functions, accounts payable, back office operations, and more. By outsourcing these functions, you can gain greater control over your organization’s operations, improve efficiency, and enhance productivity. Our team of highly skilled professionals has extensive experience in providing functional outsourcing services across various industries.",
      "We understand the complexities of different business functions and are committed to delivering high-quality, cost-effective solutions."
    ],

    detailedServices: [
      {
        title: "HR Functions Outsourcing",
        description: "Outsourcing HR tasks allows you to free up internal resources for strategic initiatives. We handle recruitment, talent management, onboarding, training, benefits administration, payroll, compliance, and risk management."
      },
      {
        title: "Accounts Payable Outsourcing",
        description: "We help reduce manual errors and improve cash flow management. Our team utilizes specialized accounting expertise and technology to enhance compliance, manage risks, and ensure seamless payment processing."
      },
      {
        title: "Back Office Function Outsourcing",
        description: "We manage critical back office functions such as accounting, finance, and administrative support. This helps improve accuracy in financial management, enhance customer service, and reduce operational costs."
      },
      {
        title: "Strategic Advisory",
        description: "We don't just execute tasks; we help you develop customized outsourcing strategies that align with your unique business goals, ensuring a smooth transition and long-term success."
      }
    ],

    coreServices: [
      {
        title: "Recruitment & Talent Management",
        description: "We manage the entire lifecycle of your workforce, from finding the right talent to onboarding and training them effectively."
      },
      {
        title: "Financial Transaction Processing",
        description: "Our experts handle high-volume financial transactions like invoices and payments with precision, ensuring your cash flow remains healthy."
      },
      {
        title: "Compliance & Risk Management",
        description: "We stay up-to-date with changing regulations so you don't have to, minimizing legal risks associated with HR and finance."
      },
      {
        title: "Operational Analytics",
        description: "We provide detailed insights into your operational performance, helping you make data-driven decisions to drive growth."
      }
    ],

    benefitsDetail: [
      {
        title: "Cost Savings",
        description: "By outsourcing non-core functions, you can reduce labor costs and minimize overhead expenses significantly."
      },
      {
        title: "Increased Efficiency",
        description: "Specialized providers can optimize processes and improve productivity, resulting in faster turnaround times and better quality."
      },
      {
        title: "Improved Quality",
        description: "External providers bring new skills and expertise, ensuring that your functions are executed to the highest industry standards."
      },
      {
        title: "Scalability",
        description: "Functional outsourcing allows you to scale your operations up or down as needed, without investing in new infrastructure or personnel."
      },
      {
        title: "Focus on Core Business",
        description: "Free up your internal team to concentrate on strategic initiatives that drive business growth, such as market expansion and customer insights."
      }
    ],

    whyChooseUs: [
      {
        title: "Proven Track Record",
        description: "Our clients have seen real results: 20% cost reduction in HR functions and 30% efficiency improvement in accounts payable."
      },
      {
        title: "Customized Strategies",
        description: "We don't offer one-size-fits-all solutions. We identify your specific needs and build a strategy that fits your business model."
      },
      {
        title: "Risk Mitigation",
        description: "We identify and mitigate risks associated with outsourcing, ensuring a secure and compliant transition of responsibilities."
      },
      {
        title: "Dedicated Team & Support",
        description: "You get a dedicated team of experts providing ongoing support and monitoring to ensure consistent performance."
      }
    ],

    workProcess: [
      {
        title: "Consultation",
        description: "We discuss your specific requirements to understand which functions are best suited for outsourcing."
      },
      {
        title: "Strategy Development",
        description: "We develop a customized outsourcing strategy that identifies risks, costs, and projected efficiency gains."
      },
      {
        title: "Transition & Implementation",
        description: "Our team manages the transfer of responsibilities seamlessly, ensuring zero disruption to your daily operations."
      },
      {
        title: "Ongoing Monitoring",
        description: "We provide continuous support and performance monitoring to ensure the outsourced functions continue to add value."
      }
    ],

    otherServices: [
      "Finance Consulting",
      "Back office Automation Service",
      "Mystery Audits",
      "Payroll Management",
      "Bookkeeping Services",
      "Virtual Assistant Services",
      "Attrition Management",
      "Process Outsourcing",
      "Manpower Outsourcing"
    ]
  },
  { 
    id: "service4", 
    title: "Mystery Audits", 
    icon: Search, 
    color: "#0F172A", 
    shortDescription: "Gain unfiltered insights into customer experience and compliance through discreet evaluations by trained auditors.",
    
    introText: [
      "In today’s competitive business environment, customer experience and operational efficiency are more important than ever. A mystery audit, also known as a mystery shopping service, is one of the most effective tools to assess these aspects discreetly. At YF Advisors, we are among the leading mystery audit companies in India, helping businesses gain valuable insights into their customer-facing operations.",
      "A mystery audit involves sending anonymous, trained auditors to interact with your business as regular customers would. These auditors assess the overall experience, including customer service, product quality, and compliance with business policies. The results help identify areas for improvement, enabling businesses to enhance service quality and customer satisfaction.",
      "In the dynamic markets of India, standing still means falling behind. A mystery audit provides an unfiltered view of your operations, highlighting strengths to build upon and weaknesses to address. It's not about fault finding; it's about seizing opportunities for growth."
    ],

    detailedServices: [
      {
        title: "Mystery Calls",
        description: "We evaluate your standard operating procedures (SOPs) and telephone etiquette by making anonymous calls to your locations, assessing communication quality and staff knowledge."
      },
      {
        title: "Mystery Visits",
        description: "Our auditors physically visit your stores to evaluate parameters like store ambience, staff grooming, product knowledge, selling techniques, and cashier interaction."
      },
      {
        title: "Mystery Emails",
        description: "We assess the efficiency of your digital communication by measuring response times, clarity, and the helpfulness of email replies to customer inquiries."
      },
      {
        title: "Product Placement Audits",
        description: "We verify the placement and visibility of products within stores to ensure brand visibility and correct positioning according to your planograms and guidelines."
      },
      {
        title: "Price Check Audits",
        description: "We verify that products are being sold at the correct price and ensuring price integrity across all your locations to prevent revenue leakage."
      },
      {
        title: "Integrity Check Audits",
        description: "Conducted to identify malpractices, such as the unauthorized sharing of sensitive leads or fraudulent activities within a store or organization."
      },
      {
        title: "Customer Experience Mapping",
        description: "We map the entire customer journey from first contact to purchase, identifying gaps and friction points that need immediate attention."
      }
    ],

    coreServices: [
      {
        title: "Retail Stores",
        description: "Assess customer service, product availability, and in-store experience to ensure consistent brand standards."
      },
      {
        title: "Restaurants & Cafes",
        description: "Evaluate food quality, service speed, hygiene standards, and customer interactions during peak and non-peak hours."
      },
      {
        title: "Financial Services",
        description: "Ensure compliance with regulatory requirements and assess customer service quality across bank branches and financial outlets."
      },
      {
        title: "Hospitality",
        description: "Gauge the quality of guest services in hotels, resorts, and entertainment venues, from check-in to check-out."
      }
    ],

    benefitsDetail: [
      {
        title: "Expert Auditors with Domain Experience",
        description: "We bring a diverse bench of skilled auditors with specific domain expertise, ensuring audits are accurate and identify relevant areas for improvement."
      },
      {
        title: "Increased Efficiency",
        description: "Outsourcing audits allows you to eliminate human error associated with internal reviews and improves overall audit productivity using skilled professionals."
      },
      {
        title: "Flexible Staffing Solutions",
        description: "Eliminate the carrying costs of internal audit staff while benefiting from flexible resources that scale to meet your varying audit needs."
      },
      {
        title: "Enhanced Focus on Core Business",
        description: "Your employees can focus on their primary roles while we handle compliance, customer experience mapping, and operational assessments."
      },
      {
        title: "Stronger Brand Loyalty",
        description: "By addressing areas that negatively impact customer experience, you build trust and consistency, leading to higher customer retention."
      }
    ],

    whyChooseUs: [
      {
        title: "Experienced Auditors",
        description: "Our team consists of skilled and trained professionals who are experts in evaluating business operations without drawing attention."
      },
      {
        title: "Tailored Solutions",
        description: "We customize our mystery audit services to match the specific needs of your business, ensuring that all key areas are thoroughly evaluated."
      },
      {
        title: "Detailed Reporting",
        description: "After each audit, we provide comprehensive reports with actionable recommendations to help you improve your operations immediately."
      },
      {
        title: "Advanced Technology",
        description: "We use cutting-edge technology to track and analyze data, giving you real-time insights into your business’s performance."
      }
    ],

    workProcess: [
      {
        title: "Initial Consultation",
        description: "We start with a thorough discussion to understand your business objectives and areas of concern."
      },
      {
        title: "Customized Audit Plan",
        description: "We design a specific audit framework tailored to your industry standards and goals."
      },
      {
        title: "Execution",
        description: "Our mystery auditors conduct the visits, calls, or checks discreetly and professionally."
      },
      {
        title: "Analysis & Action Plan",
        description: "We analyze the data to provide a detailed report and a clear action plan for improvement."
      }
    ],

    otherServices: [
      "Finance Consulting",
      "Back office Automation Service",
      "Functional Outsourcing",
      "Payroll Management",
      "Bookkeeping Services",
      "Virtual Assistant Services",
      "Attrition Management",
      "Process Outsourcing"
    ]
  },
  { 
    id: "service5", 
    title: "Payroll Management", 
    icon: Banknote, 
    color: "#0AA8A3", 
    shortDescription: "End-to-end cloud-based payroll processing ensuring 100% accuracy, timely payments, and strict regulatory compliance.",
    
    introText: [
      "Managing payroll can be one of the most time-consuming and complex tasks for businesses of any size. At YF Advisors, we understand the importance of ensuring that your employees are paid accurately, on time, and in full compliance with all applicable laws. As a leading provider of payroll management services, we offer customized, scalable solutions that free up your internal resources, allowing you to focus on growing your business while we handle the intricacies of payroll processing.",
      "With a strong emphasis on accuracy, compliance, and efficiency, YF Advisors provides end-to-end managed payroll services that cater to businesses across various industries. Whether you are a startup, a growing mid-sized business, or a large enterprise with complex payroll needs, our solutions are designed to meet the demands of your organization. Our cloud-based payroll management system ensures that you have 24/7 access to real-time payroll data, giving you full transparency and control over your payroll processes at all times."
    ],

    detailedServices: [
      {
        title: "End-to-End Payroll Processing",
        description: "We handle every aspect of payroll, from calculating salaries and managing hourly/contract workers to handling overtime, bonuses, and commissions with precision."
      },
      {
        title: "Tax Compliance and Filings",
        description: "We take the stress out of tax management by ensuring accurate calculation and timely filing of income tax, social security, and statutory deductions (Form 24Q, Form 27A), preventing penalties."
      },
      {
        title: "Cloud-Based Management System",
        description: "Gain 24/7 real-time access to your payroll data, reports, and compliance status from anywhere through our secure online platform, ensuring full transparency."
      },
      {
        title: "Comprehensive Payroll Reporting",
        description: "We provide detailed reports on expenses, employee compensation, and tax liabilities to help you maintain financial transparency and make informed business decisions."
      },
      {
        title: "Employee Self-Service Portal",
        description: "Empower your workforce with a portal where they can access payslips and tax documents anytime, reducing routine inquiries for your HR staff."
      },
      {
        title: "International Payroll Support",
        description: "For businesses with a global presence, we manage currency conversions, local tax filings, and compliance with country-specific employment regulations."
      }
    ],

    coreServices: [
      {
        title: "Salary Structure Optimization",
        description: "We help design tax-efficient salary structures that benefit both the employer and the employee, ensuring compliance with minimum wage laws."
      },
      {
        title: "Statutory Compliance Management",
        description: "We manage PF, ESIC, PT, and LWF compliance, ensuring your organization meets all state and central labor law requirements."
      },
      {
        title: "Leave & Attendance Management",
        description: "Our systems integrate payroll with attendance data to ensure accurate payouts based on actual days worked, leave balances, and loss of pay."
      },
      {
        title: "Full & Final Settlement",
        description: "We handle the entire exit process for employees, including accurate calculation of notice period pay, leave encashment, and gratuity."
      }
    ],

    benefitsDetail: [
      {
        title: "Improved Accuracy",
        description: "Rest assured that payments, taxes, and deductions are processed with precision, drastically reducing the risk of costly errors."
      },
      {
        title: "Timely Payments",
        description: "We ensure your employees are paid on time, every time, improving employee satisfaction and maintaining a positive workplace culture."
      },
      {
        title: "Regulatory Compliance",
        description: "Never worry about falling behind on tax laws or facing penalties. We ensure full compliance with local, state, and federal regulations."
      },
      {
        title: "Cost Savings",
        description: "Eliminate the need for a dedicated in-house payroll team and save money on staffing, training, and expensive payroll software."
      },
      {
        title: "Increased Efficiency",
        description: "Free your HR team to focus on strategic initiatives like talent acquisition and employee development instead of administrative tasks."
      }
    ],

    whyChooseUs: [
      {
        title: "Cloud-Based Transparency",
        description: "Our system gives you 24/7 real-time access to payroll data, ensuring you remain in control of your operations at all times."
      },
      {
        title: "Scalable Solutions",
        description: "Whether you have 50 or 5,000 employees, our solutions grow with you, handling increased complexity without disruption."
      },
      {
        title: "Data Security",
        description: "We prioritize the security of sensitive employee and financial data with robust encryption and secure access protocols."
      },
      {
        title: "Expert Support",
        description: "Our team of payroll experts is always available to resolve queries and provide guidance on complex compensation matters."
      }
    ],

    workProcess: [
      {
        title: "Data Collection",
        description: "We gather attendance, leave, and compensation data securely from your existing systems."
      },
      {
        title: "Processing & Validation",
        description: "Our experts process the payroll, validate calculations, and run compliance checks."
      },
      {
        title: "Approval & Disbursement",
        description: "You review and approve the final payroll sheet before we initiate secure salary disbursements."
      },
      {
        title: "Reporting & Compliance",
        description: "We generate payslips, file necessary taxes, and provide you with detailed financial reports."
      }
    ],

    otherServices: [
      "Finance Consulting",
      "Back office Automation Service",
      "Functional Outsourcing",
      "Mystery Audits",
      "Bookkeeping Services",
      "Virtual Assistant Services",
      "Attrition Management",
      "Process Outsourcing"
    ]
  },
  { 
    id: "service6", 
    title: "Bookkeeping Services", 
    icon: FileText, 
    color: "#0F172A", 
    shortDescription: "Meticulous management of your books, financial reporting, and compliance so you can focus on growing your enterprise.",
    
    introText: [
      "Running a business is challenging enough without having to worry about the tedious task of bookkeeping. Our team of financial experts will meticulously manage your books, giving you back the time and energy to focus on growing your enterprise.",
      "From payroll & bookkeeping services to tax & business management, we give you the flexibility to run your business with ease & reduce costs on every level. Our bookkeeping services specialists are experts in all major accounting systems, including QuickBooks, Sage, and more, meaning you get a low-cost professional solution that makes running your business easier."
    ],

    detailedServices: [
      {
        title: "Financial Reporting and Analysis",
        description: "We prepare accurate financial statements (balance sheet, income statement, cash flow) and provide in-depth performance analysis to guide your strategic decisions."
      },
      {
        title: "Tax Compliance and Planning",
        description: "Our experts handle the preparation and filing of corporate, individual, and payroll tax returns, along with proactive tax planning strategies to optimize your liabilities."
      },
      {
        title: "Accounts Payable & Receivable",
        description: "We streamline your cash flow by efficiently managing your bills and invoices, ensuring you pay on time and get paid faster."
      },
      {
        title: "Bank Reconciliations",
        description: "We meticulously reconcile your bank statements with your internal records to identify discrepancies, prevent fraud, and ensure an accurate view of your cash position."
      },
      {
        title: "Payroll Management",
        description: "We handle end-to-end payroll processing, tax compliance, and benefits administration, ensuring your employees are paid accurately and on time."
      },
      {
        title: "Fixed Assets Verification",
        description: "We help you track and manage your fixed assets through physical verification and tagging, ensuring accurate depreciation calculations and asset protection."
      },
      {
        title: "Cost Audit & Gap Analysis",
        description: "Our team conducts thorough cost audits to identify inefficiencies and provides actionable recommendations for significant cost reductions."
      }
    ],

    coreServices: [
      {
        title: "QuickBooks Expertise",
        description: "We are experts in QuickBooks Online and Desktop versions (Certified Intuit Pro Advisor), ensuring your books are managed using the industry-standard software."
      },
      {
        title: "US Accounting Standards",
        description: "We have deep expertise in US accounting practices, making us the ideal partner for US-based businesses looking for outsourced support."
      },
      {
        title: "Customized Reporting",
        description: "Beyond standard reports, we generate customized dashboards, budget vs. actuals, and ratio analyses to aid in specific strategic decision-making."
      },
      {
        title: "Audit & Assurance",
        description: "We provide internal control reviews, financial statement audits, and compliance assessments to keep your business audit-ready at all times."
      }
    ],

    benefitsDetail: [
      {
        title: "Accurate Books, Stress-Free Taxes",
        description: "With our comprehensive bookkeeping, you’ll have the financial records you need to file taxes with confidence and avoid costly mistakes."
      },
      {
        title: "Insights to Drive Decisions",
        description: "Gain deeper visibility into your financial health with data-driven intelligence that helps you improve profitability and achieve business goals."
      },
      {
        title: "Scalable Solutions",
        description: "Whether you’re a solopreneur or a multi-million dollar enterprise, our flexible packages are tailored to meet your unique needs and budget."
      },
      {
        title: "Cost Savings",
        description: "Reduce operational costs by using our specialized infrastructure and team, saving valuable managerial time and avoiding the overhead of in-house staff."
      },
      {
        title: "Secure & Efficient",
        description: "We use the latest secure technology (Right Networks, LogMeIn, GoToMyPC) to access your books securely, ensuring data protection and efficiency."
      }
    ],

    whyChooseUs: [
      {
        title: "25 Years of Experience",
        description: "We bring a quarter-century of expertise in outsourced accounting, financial, and bookkeeping services across various industries."
      },
      {
        title: "100% Client Satisfaction",
        description: "Our clients, ranging from small businesses to large enterprises, consistently rate us highly for our accuracy, timeliness, and caring attitude."
      },
      {
        title: "World-Class Team",
        description: "Our team includes Chartered Accountants and certified professionals who act as your trusted consultants, not just data entry clerks."
      },
      {
        title: "No Hidden Fees",
        description: "Our pricing models are transparent and competitive, with clear deliverables and no surprise costs."
      }
    ],

    workProcess: [
      {
        title: "Send Documents",
        description: "Scan and upload your source documents to our secure server or email them to our dedicated mailbox."
      },
      {
        title: "Secure Connection",
        description: "We connect securely to your accounting software (QuickBooks, Sage, etc.) using remote desktop services or secure login credentials."
      },
      {
        title: "Update Records",
        description: "Our experts update your ledgers, reconcile accounts, and process transactions accurately within the software."
      },
      {
        title: "Reporting & Review",
        description: "We generate financial reports (weekly, monthly, or quarterly) and log out, letting you review your updated, accurate books."
      }
    ],

    otherServices: [
      "Finance Consulting",
      "Back office Automation Service",
      "Functional Outsourcing",
      "Mystery Audits",
      "Payroll Management",
      "Virtual Assistant Services",
      "Attrition Management",
      "Process Outsourcing",
      "Manpower Outsourcing"
    ]
  },
  { 
    id: "service7", 
    title: "Virtual Assistant Services", 
    icon: Headphones, 
    color: "#0AA8A3", 
    shortDescription: "Dedicated administrative support tailored to meet your unique needs, from email management to event coordination.",
    
    introText: [
      "At Professional Administrative Assistant Services, we understand that managing the day-to-day operations of your business can be challenging. That’s why we’re here to offer virtual assistant services for expert administrative support tailored to meet your unique needs. Whether you’re a small business owner, a busy executive, or an entrepreneur on the go, our team of dedicated administrative professionals is ready to assist you.",
      "Embark on Your Delegation Journey with Us. With 25 years of experience, we work tirelessly selecting, assessing, and interviewing candidates—demanding exceptional traits and experience—so you can focus on growing your business while we handle the rest."
    ],

    detailedServices: [
      {
        title: "General Virtual Assistance",
        description: "From managing emails and scheduling appointments to handling travel arrangements and conducting research, our virtual assistants ensure you stay organized and focused on your priorities."
      },
      {
        title: "Office Management",
        description: "We offer administrative support to maintain smooth office operations. This includes managing correspondence, organizing files, and overseeing office supplies to keep your workplace running efficiently."
      },
      {
        title: "Event Coordination",
        description: "Whether it’s a corporate event, seminar, or team-building retreat, our team can manage all aspects of event planning and coordination, ensuring your event is a success from start to finish."
      },
      {
        title: "Document Preparation",
        description: "Need help drafting presentations, reports, or spreadsheets? Our administrative experts excel in creating professional documents that reflect the quality and professionalism of your business."
      },
      {
        title: "Customer Support",
        description: "Providing excellent customer service is essential. Our team can handle customer inquiries, resolve issues promptly, and ensure your clients receive the attention they deserve."
      }
    ],

    coreServices: [
      {
        title: "40 Hours Monthly Plan",
        description: "Ideal for light assistance. Includes a dedicated part-time virtual professional, account manager, and tech support. No hidden fees."
      },
      {
        title: "80 Hours Monthly Plan",
        description: "Perfect for growing businesses. Includes 80 hours of task work, staff tracking systems, and video chat capabilities with your virtual team."
      },
      {
        title: "Full-Time Plan (160 Hours)",
        description: "Maximum efficiency for busy executives. A dedicated full-time professional working in your preferred time zone with complete administrative support."
      },
      {
        title: "US-Based VA Support",
        description: "Premium local support with specific time-zone alignment, cultural fluency, and dedicated account management for specialized needs."
      }
    ],

    benefitsDetail: [
      {
        title: "Expertise and Experience",
        description: "With years of experience in administrative support, our team brings a wealth of knowledge and skills to every project. We work tirelessly selecting and assessing the best talent."
      },
      {
        title: "Reliability",
        description: "You can count on us to deliver high-quality service consistently, meeting deadlines and exceeding expectations every single time."
      },
      {
        title: "Customized Solutions",
        description: "We understand that every business is unique. That’s why we offer customized solutions tailored to your specific requirements and preferences."
      },
      {
        title: "Cost-Effective",
        description: "Outsourcing administrative tasks to us can save you time and money, allowing you to focus on growing your business instead of managing overhead."
      }
    ],

    whyChooseUs: [
      {
        title: "25 Years of Experience",
        description: "We bring decades of industry experience to the table, ensuring that your administrative needs are handled with professional maturity."
      },
      {
        title: "100% Client Satisfaction",
        description: "Our clients consistently rate us highly for our caring attitude, timely service, and ability to bend over backwards to fulfill requirements."
      },
      {
        title: "World Class Talent",
        description: "Access a pool of over 18,000 world-class workers. We find the best assistants by demanding exceptional traits and experience."
      },
      {
        title: "No Hidden Fees",
        description: "Our pricing is transparent. whether you choose a monthly plan or hourly support, you know exactly what you are paying for."
      }
    ],

    workProcess: [
      {
        title: "Consultation",
        description: "Reach out to us today to discover how we can make a difference. We discuss your specific administrative bottlenecks."
      },
      {
        title: "Selection & Matching",
        description: "We select a dedicated virtual professional based on your industry needs, time zone preferences, and required skill set."
      },
      {
        title: "Onboarding",
        description: "We set up staff tracking systems, communication channels (Video Chat/Call), and integrate with your workflow."
      },
      {
        title: "Execution & Support",
        description: "Your VA handles the tasks while a dedicated account manager ensures quality and provides tech support as needed."
      }
    ],

    otherServices: [
      "Finance Consulting",
      "Back office Automation Service",
      "Functional Outsourcing",
      "Mystery Audits",
      "Payroll Management",
      "Bookkeeping Services",
      "Attrition Management",
      "Process Outsourcing"
    ]
  },
  { 
    id: "service8", 
    title: "Attrition Management", 
    icon: UserMinus, 
    color: "#0F172A", 
    shortDescription: "Strategic measures to mitigate employee turnover risks, enhance retention, improve engagement, and foster a thriving workplace culture.",
    
    introText: [
      "Employee attrition is one of the most pressing challenges faced by businesses today. High turnover rates not only disrupt business operations but also increase recruitment costs, lower morale, and negatively impact overall productivity. At YF Advisors, we understand the complexities involved in managing attrition and the direct consequences it has on your business.",
      "Our Attrition Management Services are designed to help organizations mitigate the risks associated with employee turnover by implementing strategic measures that enhance retention, improve engagement, and foster a thriving workplace culture. We aim to ensure that your company not only attracts top talent but also retains them, creating a stable, motivated, and high-performing workforce.",
      "Attrition management is not just about replacing employees; it’s about preventing them from leaving in the first place. Our approach focuses on identifying key drivers of employee satisfaction, addressing gaps in organizational processes, and developing retention strategies that align with your business objectives."
    ],

    detailedServices: [
      {
        title: "In-Depth Attrition Analysis",
        description: "We conduct a comprehensive analysis of your organization’s attrition patterns, looking at factors such as job roles, departments, tenure, and exit feedback to pinpoint root causes."
      },
      {
        title: "Customized Retention Strategies",
        description: "We design personalized retention strategies involving management practices, employee engagement programs, and compensation policies aligned with your organizational goals."
      },
      {
        title: "Manpower Outsourcing Solutions",
        description: "For high-turnover roles, we offer outsourcing services to maintain your workforce stability without the administrative burden of full-time employee management."
      },
      {
        title: "Recruitment and Selection Optimization",
        description: "We refine your hiring process using behavioral assessments and deep role clarification to ensure new hires are a perfect cultural and technical fit."
      },
      {
        title: "Training and Orientation Programs",
        description: "We develop comprehensive onboarding programs covering technical and soft skills to ensure new hires integrate quickly, reducing early-stage turnover."
      }
    ],

    coreServices: [
      {
        title: "Employee Engagement",
        description: "We help you develop programs that keep your workforce motivated, passionate, and emotionally invested in their roles."
      },
      {
        title: "Career Growth Pathways",
        description: "We assist in creating internal mobility programs and leadership development initiatives that encourage employees to stay for the long term."
      },
      {
        title: "Work-Life Balance Initiatives",
        description: "We recommend and implement practices like flexible work arrangements and wellness programs to prevent burnout."
      },
      {
        title: "Job Role Clarification",
        description: "We ensure job descriptions align perfectly with reality to prevent expectation mismatches that lead to early resignation."
      }
    ],

    benefitsDetail: [
      {
        title: "Reduced Recruitment Costs",
        description: "Hiring and training new employees is expensive. By reducing turnover, you can minimize these costs and focus your resources on growth."
      },
      {
        title: "Increased Productivity",
        description: "A stable workforce develops the institutional knowledge and expertise needed to perform at a higher level consistently."
      },
      {
        title: "Improved Morale",
        description: "By addressing root causes of turnover, you create a positive environment that motivates employees to stay and contribute to the company’s success."
      },
      {
        title: "Enhanced Employer Brand",
        description: "Companies known for retaining talent have a competitive edge. Effective attrition management builds your reputation as an employer of choice."
      }
    ],

    whyChooseUs: [
      {
        title: "Data-Driven Approach",
        description: "We rely on data to drive our strategies, ensuring that every decision is backed by real insights into your organization’s unique patterns."
      },
      {
        title: "End-to-End Support",
        description: "From initial analysis to implementation and ongoing monitoring, we provide comprehensive support throughout the lifecycle."
      },
      {
        title: "Expertise and Experience",
        description: "Our team brings a wealth of knowledge in HR processes and organizational psychology to navigate the complexities of turnover."
      },
      {
        title: "Proven Results",
        description: "Our clients have seen significant improvements in retention and satisfaction while simultaneously reducing recruitment overhead."
      }
    ],

    workProcess: [
      {
        title: "Analysis",
        description: "We analyze attrition data, exit interviews, and employee feedback to find the 'why'."
      },
      {
        title: "Strategy Formulation",
        description: "We develop a bespoke retention plan addressing culture, compensation, and growth."
      },
      {
        title: "Implementation",
        description: "We roll out training, engagement programs, or policy changes within your teams."
      },
      {
        title: "Monitoring",
        description: "We continuously track retention rates and morale to ensure long-term stability."
      }
    ],

    otherServices: [
      "Finance Consulting",
      "Back office Automation Service",
      "Functional Outsourcing",
      "Mystery Audits",
      "Payroll Management",
      "Bookkeeping Services",
      "Virtual Assistant Services",
      "Process Outsourcing",
      "Manpower Outsourcing"
    ]
  },
  { 
    id: "process-outsourcing", 
    title: "Process Outsourcing", 
    icon: Settings, 
    color: "#0AA8A3", 
    shortDescription: "Streamline non-core activities like procurement, HR, and finance to focus on driving business growth and innovation.",
    
    introText: [
      "At YF Advisors, we specialize in delivering comprehensive business process outsourcing (BPO) solutions tailored to meet the evolving needs of businesses in various industries. Our process outsourcing services are designed to help you streamline non-core activities, allowing you to focus on what truly matters: driving business growth and innovation.",
      "By leveraging our expertise, we help you reduce operational costs, improve process efficiency, and enhance service quality across multiple business functions. From sourcing and procurement to talent management, we provide the infrastructure and expertise needed to scale efficiently."
    ],

    detailedServices: [
      {
        title: "Sourcing and Procurement (AP)",
        description: "We handle your entire accounts payable operations, ensuring smooth vendor management, timely payments, and optimized procurement processes to reduce overhead costs."
      },
      {
        title: "Supply Chain Management",
        description: "Our end-to-end solutions cover inventory control to logistics coordination. We ensure transparency and efficiency, minimizing delays and cutting costs."
      },
      {
        title: "Sales & Customer Operations (AR)",
        description: "We manage accounts receivable to ensure prompt invoicing and collections. We streamline processes to keep cash flow healthy while maintaining strong customer relationships."
      },
      {
        title: "Talent & HR Solutions (RPO)",
        description: "From workforce planning to employee onboarding and performance management, we help you attract and retain the best talent while ensuring HR compliance."
      },
      {
        title: "Banking Process Outsourcing",
        description: "We offer specialized solutions including transaction processing, loan servicing, and regulatory compliance support, ensuring secure and efficient financial operations."
      },
      {
        title: "Record to Report (R2R)",
        description: "We handle everything from journal entries and reconciliations to financial reporting and analysis, ensuring timely and accurate preparation of financial statements."
      },
      {
        title: "Shared Service Solutions",
        description: "We help you consolidate back-office functions such as finance, HR, and IT into a centralized operation to enhance collaboration and reduce operational costs."
      }
    ],

    coreServices: [
      {
        title: "Cost Efficiency",
        description: "Outsourcing with us reduces operational costs by providing access to skilled professionals without the overhead of maintaining large in-house teams."
      },
      {
        title: "Agility and Scalability",
        description: "Our flexible solutions allow you to scale operations instantly—whether handling seasonal peaks or expanding into new markets."
      },
      {
        title: "Compliance Management",
        description: "We ensure all processes adhere to industry standards and regulatory requirements, minimizing risks across your business functions."
      },
      {
        title: "Focus on Core Competencies",
        description: "By offloading routine tasks to us, your leadership team can focus purely on driving innovation and accelerating market growth."
      }
    ],

    benefitsDetail: [
      {
        title: "Reduced Operational Costs",
        description: "Lower your overhead significantly by leveraging our shared resources and optimized processes."
      },
      {
        title: "Improved Process Efficiency",
        description: "We bring best-in-class workflows and technology to streamline your back-office operations, reducing cycle times."
      },
      {
        title: "Enhanced Service Quality",
        description: "Our specialized teams focus solely on their functional areas, resulting in higher accuracy and better service delivery."
      },
      {
        title: "Risk Mitigation",
        description: "We manage regulatory compliance and operational risks, ensuring your business remains secure and compliant."
      },
      {
        title: "24/7 Support",
        description: "We offer round-the-clock support to ensure seamless operations across different time zones and business hours."
      }
    ],

    whyChooseUs: [
      {
        title: "Expertise Across Industries",
        description: "We have deep knowledge in finance, HR, supply chain, and banking, catering to businesses in multiple sectors."
      },
      {
        title: "Customized Solutions",
        description: "We don't believe in one-size-fits-all. We tailor our outsourcing models to meet the unique needs of your business."
      },
      {
        title: "Technology Driven",
        description: "We utilize the latest automation and reporting tools to ensure your outsourced processes are transparent and efficient."
      },
      {
        title: "Global Standards",
        description: "Our processes are designed to meet international standards of quality, security, and compliance."
      }
    ],

    workProcess: [
      {
        title: "Assessment",
        description: "We analyze your current processes to identify inefficiencies and areas suitable for outsourcing."
      },
      {
        title: "Transition Planning",
        description: "We design a roadmap to transfer processes smoothly without disrupting your daily operations."
      },
      {
        title: "Execution & Management",
        description: "Our team takes over the functions, applying best practices and automation to optimize performance."
      },
      {
        title: "Continuous Improvement",
        description: "We regularly review performance metrics and refine processes to ensure ongoing efficiency gains."
      }
    ],

    otherServices: [
      "Finance Consulting",
      "Back office Automation Service",
      "Functional Outsourcing",
      "Mystery Audits",
      "Payroll Management",
      "Bookkeeping Services",
      "Virtual Assistant Services",
      "Attrition Management"
    ]
  },
  { 
    id: "service10", 
    title: "Manpower Outsourcing", 
    icon: UserCheck, 
    color: "#0F172A", 
    shortDescription: "Streamline your staffing needs with temporary, permanent, and RPO solutions tailored to your operational goals.",
    
    introText: [
      "In today’s competitive business landscape, hiring the right talent is both crucial and challenging. At YF Advisors, we specialize in manpower outsourcing services that streamline your staffing needs, allowing you to focus on what matters most—growing your business. Whether you need temporary staff for short-term projects or permanent employees for long-term success, our solutions are designed to fit seamlessly into your operational goals.",
      "Our dedicated team works closely with you to understand your specific requirements, ensuring you get the best talent from our vast network of professionals. By partnering with YF Advisors, you gain access to top-notch experts without the high costs and complexities of traditional hiring."
    ],

    detailedServices: [
      {
        title: "Temporary Staffing",
        description: "Need extra hands during peak seasons or specific projects? We provide skilled temporary staff who can jump in immediately to ensure your operations continue without hiccups, whether for a few weeks or several months."
      },
      {
        title: "Permanent Staffing",
        description: "We take the guesswork out of recruitment. Our team thoroughly screens and evaluates candidates to ensure they align with your company’s culture and meet your long-term job requirements perfectly."
      },
      {
        title: "Recruitment Process Outsourcing (RPO)",
        description: "Let us handle your entire recruitment process, from job postings and sourcing to interviews and onboarding. We save you time, allowing you to focus on core business strategies while we bring the best talent to your doorstep."
      },
      {
        title: "Payroll and HR Administration",
        description: "Our efficient payroll services ensure timely salary disbursals, tax compliance, and benefits management. Offload these repetitive tasks to us so you can focus on growth."
      },
      {
        title: "HR Project Assistance",
        description: "We offer dedicated support for complex HR challenges, such as implementing new policies, restructuring teams, or expanding into new regions."
      },
      {
        title: "Talent Management",
        description: "Nurture and retain your best employees with our performance assessments, career development programs, and succession planning services."
      },
      {
        title: "Compliance Management",
        description: "We ensure all your HR and staffing processes comply with relevant labor laws and industry regulations, helping you avoid legal pitfalls."
      },
      {
        title: "Training and Development",
        description: "From leadership training to technical skill-building, we provide the resources your employees need to perform at their best and excel in their roles."
      }
    ],

    coreServices: [
      {
        title: "Strategic Staffing",
        description: "We deliver flexible solutions designed to fit your business model, whether you need short-term project-based staffing or long-term strategic hires."
      },
      {
        title: "Sector-Specific Expertise",
        description: "We have extensive experience across IT, healthcare, finance, manufacturing, and retail, connecting you with professionals who bring relevant skills."
      },
      {
        title: "Workforce Optimization",
        description: "We help optimize your HR functions, reducing recruitment, training, and administrative overhead without compromising quality."
      },
      {
        title: "Regulatory Adherence",
        description: "Our in-depth knowledge of labor laws ensures your workforce management remains fully compliant at all times."
      }
    ],

    benefitsDetail: [
      {
        title: "Cost Efficiency",
        description: "Reduce recruitment, training, and administrative costs significantly. Our services help optimize your HR functions, making it affordable for SMEs and large enterprises alike."
      },
      {
        title: "Access to Wide Talent Pool",
        description: "Our vast network ensures access to a rich pool of candidates. Whether you need specialized technical experts or general admin staff, we find the right fit quickly."
      },
      {
        title: "Focus on Core Business",
        description: "By outsourcing staffing and HR processes, you free up internal resources to concentrate on driving business growth and innovation."
      },
      {
        title: "Scalable Solutions",
        description: "Our solutions are built to scale. As your business grows, we adapt our staffing services to meet your expanding workforce requirements."
      }
    ],

    whyChooseUs: [
      {
        title: "Expertise You Can Trust",
        description: "With over a decade of experience, we are a trusted partner for leading businesses, known for our knowledge of staffing trends and HR best practices."
      },
      {
        title: "Customized Solutions",
        description: "Every business is unique. We offer fully customizable manpower outsourcing solutions tailored specifically to your operational requirements."
      },
      {
        title: "Commitment to Excellence",
        description: "We are dedicated to building strong, reliable workforces. We don't just fill positions; we ensure the candidates contribute to your long-term success."
      },
      {
        title: "Rapid Turnaround",
        description: "Our streamlined processes allow us to fill vacancies faster, ensuring your business operations never miss a beat."
      }
    ],

    workProcess: [
      {
        title: "Requirement Analysis",
        description: "We work closely with you to understand your specific job roles, culture, and staffing needs."
      },
      {
        title: "Sourcing & Screening",
        description: "We leverage our vast network to source candidates and conduct rigorous screening and evaluations."
      },
      {
        title: "Selection & Onboarding",
        description: "We present the best candidates and manage the interviewing, selection, and onboarding process."
      },
      {
        title: "Management & Compliance",
        description: "For outsourced staff, we handle ongoing payroll, HR administration, and regulatory compliance."
      }
    ],

    otherServices: [
      "Finance Consulting",
      "Back office Automation Service",
      "Functional Outsourcing",
      "Mystery Audits",
      "Payroll Management",
      "Bookkeeping Services",
      "Virtual Assistant Services",
      "Attrition Management"
    ]
  },
];