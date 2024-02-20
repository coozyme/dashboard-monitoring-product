const MenuMonev = [
   {
      heading: "Dashboards",
   },
   // {
   //    icon: "growth-fill",
   //    text: "Analytics",
   //    link: "/analytics",
   // },
   {
      icon: "growth-fill",
      text: "Production Analytics",
      link: "/",
      key: "dashboard_monitoring_produksi",
   },
   {
      heading: "Orders Process",
   },
   {
      icon: "card-view",
      text: "Order Production",
      link: "/order-production",
      key: "order_production",
   },
   {
      heading: "Productions",
   },
   {
      icon: "card-view",
      text: "Production Report",
      link: "/production-report",
      key: "production_report",
   },
   {
      heading: "Categories",
   },
   {
      icon: "dot-box-fill",
      text: "Issue",
      link: "/categories-issue",
      key: "category_issue",
   },
   {
      heading: "Configuration",
   },
   {
      icon: "setting-fill",
      text: "Machine",
      link: "/machine",
      key: "configuration_machine",
   },
   {
      heading: "Manage",
   },
   {
      icon: "users-fill",
      text: "User Manage",
      key: "management_user",
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
            key: "management_role",
         },
      ],
   },
]

export default MenuMonev;