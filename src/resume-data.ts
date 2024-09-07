export const RESUME_DATA = {
    name: "Daniel Pepuho",
    location: "Jayapura, Papua",
    about: "A student with a focus on networking, programming and system administration. With over 3 years experience as an IT Infra.",
    summary:
        "",
    avatarUrl: "https://avatars.githubusercontent.com/u/69733783?v=4",
    personalWebsiteUrl: "https://danielcristho.site",
    contact: {
        email: "pepuhodaniel93@gmail.com",
        github: "danielcristho",
        linkedin: "daniel-pepuho",
        X: "chrstdan",
    },
    education: [
        {
            school: "Institut Teknologi Sepuluh Nopember",
            degree: "Bachelor's Degree in Informatics",
            start: "2020",
            end: "Present",
        },
    ],
    work: [
        {
            company: "PPDB JATIM",
            link: "https://ppdbjatim.net",
            badges: [],
            title: "IT Infra & DevOps",
            start: "2023",
            end: "2024",
            descriptions: [
                "Responsible for managing the website server used by over 500k students to enrol in local high schools. As IT Infra, I was responsible for managing servers and storage. As DevOps, I was responsible for creating automation, creating CI/CD for backend deployment, managing database, monitoring server."
            ],
            usedTechnologies: [
                "Ansible",
                "AWS Lambda",
                "DigitalOcean",
                "Docker",
                "GitHub Actions",
                "Grafana",
                "Laravel",
                "Mariadb",
                "Next.js",
                "Prometheus",
                "ProxySQL",
            ],
        },
        {
            company: "PPDB SULSEL",
            link: "https://ppdb.sulselprov.go.id",
            badges: [],
            title: "IT Infra & DevOps",
            start: "Mar 2022",
            end: "Jul 2022",
            descriptions: [
                "Responsible for managing the website server used by over 200k students to enrol in local high schools."
            ],
            usedTechnologies: [
                "Ansible",
                "DigitalOcean",
                "Lintasarta Cloudeka",
                "Laravel",
                "Next.js",
                "Nginx",
                "PostgreSQL"
            ],

        },
        {
            company: "PT. Internusa Total Solution",
            title: "IT Network Intern",
            badges: [],
            start: "Jul 2019",
            end: "Oct 2019",
            descriptions: [
                "Responsible for maintaining Internet service on the client side, monitoring network performance and network installation."
            ],
            usedTechnologies: [
                "Mikrotik",
                "Cisco",
                "Unifi (Ubiqiti)"
            ],
        },
        ],

    skills: [
        "DevOps",
        "IT Infra",
        "Sysadmin",
        "Docker",
        "Ansible",
        "MySQL/Mariadb",
        "PostgreSQL",
        "Python",
        "Cisco",
        "Mikrotik"
    ],
    projects: [
        {
        title: "danielcristho.site",
        techStack: ["Personal Project", "Astro", "Starlight"],
        description:
            "My personal website and blog. Built with Astro and Starlight",
        link: {
                label: "danielcristho.site",
                href: "https://danielcristho.site/",
            },
        },
    ],
} as const;