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
      icon: "growth-fill",
      text: "Production Analytics",
      link: "/productions-analytics",
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
      heading: "Categories",
   },
   {
      icon: "dot-box-fill",
      text: "Issue",
      link: "/categories-issue",
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
            text: "Employee",
            link: "/employee",
            key: "management_user",
         },
         {
            text: "Role",
            link: "/role",
            key: "management_user",
         },
      ],
   },
]

export default MenuMonev;