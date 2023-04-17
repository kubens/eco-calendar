export interface Town {
  id: string
  communityId: string
  name: string
  district: string
  province: string
  icon: string
  isStrNmrReq: string
  schedulePeriodId: number
}

export interface GetTownsResponse {
  towns: Town[]
}
