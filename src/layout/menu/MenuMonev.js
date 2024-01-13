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
      text: "Order Production",
      link: "/order-production",
   },
   {
      heading: "Productions",
   },
   {
      icon: "card-view",
      text: "Production Report",
      link: "/production-report",
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