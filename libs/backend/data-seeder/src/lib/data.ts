import { ICreateHourScheme, ICreateMachine, ICreateProject, ICreateUser, IMachine, IProject, IUser, UserRole } from "@hour-master/shared/api";

export const users: ICreateUser[] = [
  // Admin (0)
  {
    username: "admin",
    email: "admin@hour-master.com",
    firstname: "Damian",
    lastname: "Elenbaas",
    password: "admin",
    role: UserRole.ADMIN
  },
  // Office workers (1-3)
  {
    username: "r.bakker",
    email: "r.bakker@gmail.com",
    firstname: "Rik",
    lastname: "Bakker",
    password: "password",
    role: UserRole.OFFICE
  },
  {
    username: "j.vanderberg",
    email: "j.vanderberg@gmail.com",
    firstname: "Jan",
    lastname: "van der Berg",
    password: "password",
    role: UserRole.OFFICE
  },
  {
    username: "t.vanbeek",
    email: "t.vanbeek@gmail.com",
    firstname: "Tom",
    lastname: "van Beek",
    password: "password",
    role: UserRole.OFFICE
  },
  // Roadworkers (4-8)
  {
    username: "m.kramer",
    email: "m.kramer@gmail.com",
    firstname: "Mark",
    lastname: "Kramer",
    password: "password",
    role: UserRole.ROADWORKER
  },
  {
    username: "p.jansen",
    email: "p.jansen@gmail.com",
    firstname: "Peter",
    lastname: "Jansen",
    password: "password",
    role: UserRole.ROADWORKER
  },
  {
    username: "j.vandijk",
    email: "j.vandijk@hotmail.com",
    firstname: "Jeroen",
    lastname: "van Dijk",
    password: "password",
    role: UserRole.ROADWORKER
  },
  {
    username: "k.vanvliet",
    email: "k.vanvliet@zeelandnet.nl",
    firstname: "Kees",
    lastname: "van Vliet",
    password: "password",
    role: UserRole.ROADWORKER
  },
  {
    username: "m.vanwijk",
    email: "m.vanwijk@ziggo.nl",
    firstname: "Mark",
    lastname: "van Wijk",
    password: "password",
    role: UserRole.ROADWORKER
  },
];

export const projects: ICreateProject[] = [
  {
    name: "Avans Hogeschool, parkeerplaats",
    admin: users[1] as IUser,
    location: {
      _id: "0",
      address: "Lovensdijkstraat 61",
      city: "Breda",
      postalCode: "4818 AJ"
    }
  },
  {
    name: "BAM, A16",
    admin: users[1] as IUser,
    location: {
      _id: "1",
      address: "A16",
      city: "Rotterdam",
      postalCode: "3011 BN"
    }
  },
  {
    name: "Gemeente Breda, Nieuwe Prinsenkade",
    admin: users[2] as IUser,
    location: {
      _id: "2",
      address: "Nieuwe Prinsenkade 1",
      city: "Breda",
      postalCode: "4811 VC"
    }
  },
  {
    name: "Gemeente Tholen, Zwikkerstraat",
    admin: users[2] as IUser,
    location: {
      _id: "3",
      address: "Zwikkerstraat 1",
      city: "Tholen",
      postalCode: "4691 CS"
    }
  },
  {
    name: "Gemeente Tholen, Oud-Vossemeersedijk",
    admin: users[3] as IUser,
    location: {
      _id: "4",
      address: "Oud-Vossemeersedijk 1",
      city: "Tholen",
      postalCode: "4691 PM"
    }
  },
  {
    name: "Gemeente Bergen op Zoom, Grote Markt",
    admin: users[3] as IUser,
    location: {
      _id: "5",
      address: "Grote Markt 1",
      city: "Bergen op Zoom",
      postalCode: "4611 NT"
    }
  }
];

export const machines: ICreateMachine[] = [
  {
    name: "Kubota KX080-4 kraan",
    typeNumber: "KX080-4 (A)",
  },
  {
    name: "Kubota KX080-4 kraan",
    typeNumber: "KX080-4 (B)",
  },
  {
    name: "Alhmann AX850 shovel",
    typeNumber: "AX850 (A)",
  },
  {
    name: "Cat 308E2 kraan",
    typeNumber: "308E2 (A)",
  },
  {
    name: "Kubota RD85-7 rubsdumper",
    typeNumber: "Eco-line (A)",
  }
]

export const hourSchemes: ICreateHourScheme[] = [
  {
    date: new Date("2023-07-01"),
    worker: users[4] as IUser,
    rows: [
      {
        _id: "0",
        project: projects[0] as IProject,
        description: "Puin gestort",
        hours: 3,
        machine: machines[4] as IMachine,
      },
      {
        _id: "1",
        project: projects[0] as IProject,
        description: "Puin geëgaliseerd",
        hours: 5,
        machine: machines[0] as IMachine,
      }
    ]
  },
  {
    date: new Date("2023-07-02"),
    worker: users[4] as IUser,
    rows: [
      {
        _id: "0",
        project: projects[0] as IProject,
        description: "Troittoirbanden gezet",
        hours: 4,
      },
      {
        _id: "1",
        project: projects[0] as IProject,
        description: "Zand gestort",
        hours: 4,
        machine: machines[4] as IMachine,
      }
    ]
  },
  {
    date: new Date("2023-07-01"),
    worker: users[5] as IUser,
    rows: [
      {
        _id: "0",
        project: projects[0] as IProject,
        description: "Assisteren puin storten",
        hours: 3,
      },
      {
        _id: "1",
        project: projects[0] as IProject,
        description: "Assisteren puin egaliseren",
        hours: 5,
      }
    ]
  },
  {
    date: new Date("2023-07-03"),
    worker: users[5] as IUser,
    rows: [
      {
        _id: "0",
        project: projects[2] as IProject,
        description: "Oude beplanting verwijderd",
        hours: 4,
      },
      {
        _id: "1",
        project: projects[2] as IProject,
        description: "Grond geëgaliseerd",
        hours: 4,
      }
    ]
  },
  {
    date: new Date("2023-07-03"),
    worker: users[6] as IUser,
    rows: [
      {
        _id: "0",
        project: projects[2] as IProject,
        description: "Oude beplanting verwijderd",
        hours: 4,
        machine: machines[1] as IMachine,
      },
      {
        _id: "1",
        project: projects[2] as IProject,
        description: "Grond geëgaliseerd",
        hours: 4,
        machine: machines[1] as IMachine,
      }
    ]
  },
  {
    date: new Date("2023-07-04"),
    worker: users[6] as IUser,
    rows: [
      {
        _id: "0",
        project: projects[1] as IProject,
        description: "Oud asfalt verwijderd",
        hours: 4,
        machine: machines[2] as IMachine,
      },
      {
        _id: "1",
        project: projects[1] as IProject,
        description: "Puinfundering gestort",
        hours: 4,
        machine: machines[4] as IMachine,
      }
    ]
  },
  {
    date: new Date("2023-07-04"),
    worker: users[7] as IUser,
    rows: [
      {
        _id: "0",
        project: projects[1] as IProject,
        description: "Oud asfalt afgevoerd",
        hours: 2,
      },
      {
        _id: "1",
        project: projects[1] as IProject,
        description: "Puin gebracht naar locatie",
        hours: 2,
      },
      {
        _id: "2",
        project: projects[3] as IProject,
        description: "Machines schoongemaakt en gebracht naar locatie",
        hours: 4,
      }
    ]
  },
  {
    date: new Date("2023-07-05"),
    worker: users[8] as IUser,
    rows: [
      {
        _id: "0",
        project: projects[3] as IProject,
        description: "Machines gecontroleerd en waar nodig onderhouden",
        hours: 2,
      },
      {
        _id: "1",
        project: projects[3] as IProject,
        description: "Stoep opengebroken",
        hours: 2,
        machine: machines[3] as IMachine,
      },
      {
        _id: "2",
        project: projects[4] as IProject,
        description: "Sleuven gegraven voor kabels en leidingen",
        hours: 4,
      }
    ]
  },
  {
    date: new Date("2023-07-06"),
    worker: users[8] as IUser,
    rows: [
      {
        _id: "0",
        project: projects[5] as IProject,
        description: "Oud grind verwijderd",
        hours: 3,
        machine: machines[1] as IMachine,
      },
      {
        _id: "1",
        project: projects[5] as IProject,
        description: "Grindmatten gelegd",
        hours: 2,
      },
      {
        _id: "2",
        project: projects[5] as IProject,
        description: "Nieuwe grind gestort",
        hours: 3,
        machine: machines[2] as IMachine,
      }
    ]
  },
];
