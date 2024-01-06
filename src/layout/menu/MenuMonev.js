const MenuMonev = [
   {
      heading: "Dashboards",
   },
   {
      icon: "growth-fill",
      text: "Analytics",
      link: "/analytics",
   },
   {
      heading: "Orders Process",
   },
   {
      icon: "card-view",
      text: "Order Productions",
      link: "/order-productions",
   },
   {
      heading: "Productions",
   },
   {
      icon: "card-view",
      text: "Productions Report",
      link: "/report-productions",
   },
   {
      heading: "Configuration",
   },
   {
      icon: "setting-fill",
      text: "Machine",
      link: "/machine",
      key: "configure_machine",
   },
   {
      icon: "users-fill",
      text: "User Manage",
      active: false,
      subMenu: [
         {
            text: "Employee List",
            link: "/employee-list",
            key: "management_user",
         },
      ],
   },
]

export default MenuMonev;