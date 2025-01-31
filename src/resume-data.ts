export const RESUME_DATA = {
    name: "Daniel Pepuho",
    location: "Jayapura, Papua",
    about: "A student with a focus on networking, programming system administration & DevOps. With 3 years experience as Sysadmin & IT Infra.",
    summary: "",
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
            school: "Sepuluh Nopember Institute of Technology (ITS) Surabaya",
            degree: "Undergraduate student in Informatics.",
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
                "- Managed the server website for High School Enrollment of 500K+ candidates in East Java.",
                "- Ensured scalability and reliability under heavy traffic conditions.",
                "- Developed automation workflows using Ansible.",
                "- Built CI/CD pipelines using GitHub Actions.",
                "- Configuring and optimizing databases with ProxySQL for high availability performance.",
                "- Set up resource monitoring using Grafana and Prometheus."
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
                "ProxySQL",
                "Next.js",
                "Prometheus",
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
                "- Managed the server website for high school enrollment, serving over 175K+ candidates in South Sulawesi.",
                "- Handled servers, storage, and firewalls as IT Infra.",
                "- Deployed applications and managed web servers as DevOps.",
                "- Configured and managed databases.",
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
                "- Maintained and troubleshot internet services for clients.",
                "- Monitored network performance and implemented necessary optimizations.",
                "- Installed and configured network infrastructure.",
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
        "Network Administration",
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
        techStack: ["Personal Project", "Astro", "Starlight", "Blog"],
        description:
            "My personal website and blog. Built with Astro and Starlight",
        link: {
                label: "danielcristho.site",
                href: "https://danielcristho.site/",
            },
        },
    ],
    organizational_volunteering: [
        {
            company: "Networking Technology and Intelligent Cybersecurity Laboratory ITS",
            title: "Lab Administrator & Teaching Assistant",
            descriptions: [
                "- Participated as a collaborative team member alongside 10 other laboratory assistants, contributing to planning and supporting the implementation of laboratory activities during this period.",
                "- Served as a teaching assistant for Computer Networks and Operating Systems courses, contributing to module preparation and managing practical sessions for over 200+ students.",
            ],
            start: "2022",
            end: "2024"
        },
    ],
} as const;