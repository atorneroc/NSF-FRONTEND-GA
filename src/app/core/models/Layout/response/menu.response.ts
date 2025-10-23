export interface MenuResponse {
  user_Code: string
  id_Role: number
  role_Description: string
  privilege: boolean
  privilege_Description: string
  lstMenu: MenuListResponse[]
}

export interface MenuListResponse {
  id_Menu: number
  menu_Description: string
  icon: string
  route: string
  id_System: number
  system_Description: string
}
