export interface Street {
  id: string
  name: string
  region: string
  numbers: string
  townName: string
  townDistrict: string
  townProvince: string
}

export type GetStreetResponse = {
  streets: Street[]
}
