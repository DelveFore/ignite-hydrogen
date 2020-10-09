import { ApisauceInstance, create, ApiResponse } from "apisauce"
import { getGeneralApiProblem } from "../api-problem"
import { DEFAULT_API_CONFIG } from "./api-config"
import * as Types from "./api.types"
import { ApiConfig, HydrogenAPI, SagaSauceAPI } from "../IHydrogenAPI"

/**
 * Manages all requests to the API.
 * TODO Generator for APIs. We may need to connect to different APIs
 */
export class Api implements SagaSauceAPI, HydrogenAPI {
  /**
   * The underlying apisauce instance which performs the requests.
   */
  apisauce: ApisauceInstance

  /**
   * Configurable options.
   */
  config: ApiConfig

  /**
   * Creates the api.
   *
   * @param config The configuration to use.
   */
  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config
  }

  /**
   * Sets up the API.  This will be called during the bootup
   * sequence and will happen before the first React component
   * is mounted.
   *
   * Be as quick as possible in here.
   */
  setup() {
    // construct the apisauce instance
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
      },
    })
  }

  /* ----- Existing SagaSauce API Structure. There is much to improve though so make it your own. Very much a work in-progress ---- */
  async getData(data): Promise<ApiResponse<any>> {
    return await this.apisauce.get(`/`, data)
  }

  async createData(data): Promise<ApiResponse<any>> {
    return await this.apisauce.post(`/`, data)
  }

  async updateData(data): Promise<ApiResponse<any>> {
    return await this.apisauce.patch(`/`, data)
  }

  async deleteData(data): Promise<ApiResponse<any>> {
    return await this.apisauce.delete(`/${data.id}`, data)
  }

  /* ------ For existing Mobx-State-Tree support until we standardize on an Interface ---- */
  /**
   * Gets a list of users.
   */
  async getUsers(): Promise<Types.GetListResult> {
    // make the api call
    const response: ApiResponse<any> = await this.apisauce.get(`/`)

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // TODO API contract mutations should be in a seperate place then inside API interactions
    const convertUser = raw => {
      return {
        id: raw.id,
        name: raw.name,
      }
    }

    // transform the data into the format we are expecting
    try {
      const rawUsers = response.data
      const resultUsers: Types.User[] = rawUsers.map(convertUser)
      return { kind: "ok", data: resultUsers }
    } catch {
      return { kind: "bad-data" }
    }
  }

  /**
   * Gets a single user by ID
   */

  async getUser(id: string): Promise<Types.GetSingleResult> {
    // make the api call
    const response: ApiResponse<any> = await this.apisauce.get(`/${id}`)

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      const resultUser: Types.User = {
        id: response.data.id,
        name: response.data.name,
      }
      return { kind: "ok", data: resultUser }
    } catch {
      return { kind: "bad-data" }
    }
  }
}
