// Copyright IBM Corp. 2017,2018. All Rights Reserved.
// Node module: openapi-to-graphql
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

'use strict'

/* globals beforeAll, test, expect */

const openapiToGraphql = require('../lib/index.js')
const { graphql } = require('graphql')

let oas = require('./fixtures/example_oas.json')
const PORT = 3003
// update PORT for this test case:
oas.servers[0].variables.port.default = String(PORT)
const { startServer, stopServer } = require('./example_api_server')

let createdSchema

/**
 * Set up the schema first and run example API server
 */
beforeAll(() => {
  return Promise.all([
    openapiToGraphql.createGraphQlSchema(oas).then(({ schema }) => {
      createdSchema = schema
    }),
    startServer(PORT)
  ])
})

/**
 * Shut down API server
 */
afterAll(() => {
  return stopServer()
})

test('Get patent using basic auth', () => {
  let query = `{
    viewerBasicAuth (username: "arlene123", password: "password123") {
      patent (patentId: "100") {
        patentId
      }
    }
  }`
  return graphql(createdSchema, query, null, {}).then(result => {
    expect(result).toEqual({
      data: {
        viewerBasicAuth: {
          patent: {
            patentId: '100'
          }
        }
      }
    })
  })
})

test('Get patent using API key', () => {
  let query = `{
    viewerApiKey2 (apiKey: "abcdef") {
      patent (patentId: "100") {
        patentId
      }
    }
  }`
  return graphql(createdSchema, query, null, {}).then(result => {
    expect(result).toEqual({
      data: {
        viewerApiKey2: {
          patent: {
            patentId: '100'
          }
        }
      }
    })
  })
})

test('Get patent using API key 3', () => {
  let query = `{
    viewerApiKey3 (apiKey: "abcdef") {
      patent (patentId: "100") {
        patentId
      }
    }
  }`
  return graphql(createdSchema, query, null, {}).then(result => {
    expect(result).toEqual({
      data: {
        viewerApiKey3: {
          patent: {
            patentId: '100'
          }
        }
      }
    })
  })
})

test('Get project using API key 1', () => {
  let query = `{
    viewerApiKey (apiKey: "abcdef") {
      project (projectId: 1) {
        active
        projectId
      }
    }
  }`
  return graphql(createdSchema, query, null, {}).then(result => {
    expect(result).toEqual({
      data: {
        viewerApiKey: {
          project: {
            active: true,
            projectId: 1
          }
        }
      }
    })
  })
})

test('Get project using API key passed as option - viewer is disabled', async () => {
  let { schema } = await openapiToGraphql.createGraphQlSchema(oas, {
    viewer: false,
    headers: {
      access_token: 'abcdef'
    }
  })
  let query = `{
    project (projectId: 1) {
      projectId
    }
  }`
  return graphql(schema, query, null, {}).then(result => {
    expect(result).toEqual({
      data: {
        project: {
          projectId: 1
        }
      }
    })
  })
})

test('Get project using API key passed in the requestOptions - viewer is disabled', async () => {
  let { schema } = await openapiToGraphql.createGraphQlSchema(oas, {
    viewer: false,
    requestOptions: {
      headers: {
        access_token: 'abcdef'
      }
    }
  })
  let query = `{
    project (projectId: 1) {
      projectId
    }
  }`
  return graphql(schema, query, null, {}).then(result => {
    expect(result).toEqual({
      data: {
        project: {
          projectId: 1
        }
      }
    })
  })
})

test('Get project using API key 2', () => {
  let query = `{
    viewerApiKey2 (apiKey: "abcdef") {
      project (projectId: 1) {
        projectId
      }
    }
  }`
  return graphql(createdSchema, query, null, {}).then(result => {
    expect(result).toEqual({
      data: {
        viewerApiKey2: {
          project: {
            projectId: 1
          }
        }
      }
    })
  })
})

test('Post project using API key 1', () => {
  let query = `mutation {
    mutationViewerApiKey (apiKey: "abcdef") {
      postProjects (projectWithIdInput: {
        projectId: 123
        leadId: "arlene"
      }) {
        projectLead {
          name
        }
      }
    }
  }`
  return graphql(createdSchema, query, null, {}).then(result => {
    expect(result).toEqual({
      data: {
        mutationViewerApiKey: {
          postProjects: {
            projectLead: {
              name: 'Arlene L McMahon'
            }
          }
        }
      }
    })
  })
})

test('Post project using API key 2', () => {
  let query = `mutation {
    mutationViewerApiKey2 (apiKey: "abcdef") {
      postProjects (projectWithIdInput: {
        projectId: 123
        leadId: "arlene"
      }) {
        projectLead {
          name
        }
      }
    }
  }`
  return graphql(createdSchema, query, null, {}).then(result => {
    expect(result).toEqual({
      data: {
        mutationViewerApiKey2: {
          postProjects: {
            projectLead: {
              name: 'Arlene L McMahon'
            }
          }
        }
      }
    })
  })
})

test('Get project using API key 3', async () => {
  let query = `{
    viewerApiKey3 (apiKey: "abcdef") {
      project (projectId: 1) {
        projectId
      }
    }
  }`
  return graphql(createdSchema, query, null, {}).then(result => {
    expect(result).toEqual({
      data: {
        viewerApiKey3: {
          project: {
            projectId: 1
          }
        }
      }
    })
  })
})

test('Get project using API key 3 passed as option - viewer is disabled', async () => {
  let { schema } = await openapiToGraphql.createGraphQlSchema(oas, {
    viewer: false,
    headers: {
      cookie: 'access_token=abcdef'
    }
  })
  let query = `{
    project (projectId: 1) {
      projectId
    }
  }`
  return graphql(schema, query, null, {}).then(result => {
    expect(result).toEqual({
      data: {
        project: {
          projectId: 1
        }
      }
    })
  })
})

test('Get project using API key 3 passed in the requestOptions - viewer is disabled', async () => {
  let { schema } = await openapiToGraphql.createGraphQlSchema(oas, {
    viewer: false,
    requestOptions: {
      headers: {
        cookie: 'access_token=abcdef'
      }
    }
  })
  let query = `{
    project (projectId: 1) {
      projectId
    }
  }`
  return graphql(schema, query, null, {}).then(result => {
    expect(result).toEqual({
      data: {
        project: {
          projectId: 1
        }
      }
    })
  })
})

test('Basic AnyAuth usage', () => {
  let query = `{ 
    viewerAnyAuth(exampleApiBasicProtocol: {username: "arlene123", password: "password123"}) {
      patent (patentId: "100") {
        patentId
      }
    }
  }`
  return graphql(createdSchema, query, null, {}).then(result => {
    expect(result).toEqual({
      data: {
        viewerAnyAuth: {
          patent: {
            patentId: '100'
          }
        }
      }
    })
  })
})

test('Basic AnyAuth usage with extraneous auth data', () => {
  let query = `{ 
    viewerAnyAuth(exampleApiKeyProtocol: {apiKey: "abcdef"}, exampleApiBasicProtocol: {username: "arlene123", password: "password123"}) {
      patent (patentId: "100") {
        patentId
      }
    }
  }`
  return graphql(createdSchema, query, null, {}).then(result => {
    expect(result).toEqual({
      data: {
        viewerAnyAuth: {
          patent: {
            patentId: '100'
          }
        }
      }
    })
  })
})

test('Basic AnyAuth usage with multiple operations', () => {
  let query = `{ 
    viewerAnyAuth(exampleApiKeyProtocol2: {apiKey: "abcdef"}) {
      patent (patentId: "100") {
        patentId
      }
      project (projectId: 1) {
        projectId
      }
    }
  }`
  return graphql(createdSchema, query, null, {}).then(result => {
    expect(result).toEqual({
      data: {
        viewerAnyAuth: {
          patent: {
            patentId: '100'
          },
          project: {
            projectId: 1
          }
        }
      }
    })
  })
})

test('AnyAuth with multiple operations with different auth requirements', () => {
  let query = `{ 
    viewerAnyAuth(exampleApiBasicProtocol: {username: "arlene123", password: "password123"}, exampleApiKeyProtocol: {apiKey: "abcdef"}) {
      patent (patentId: "100") {
        patentId
      }
      project (projectId: 1) {
        projectId
      }
    }
  }`
  return graphql(createdSchema, query, null, {}).then(result => {
    expect(result).toEqual({
      data: {
        viewerAnyAuth: {
          patent: {
            patentId: '100'
          },
          project: {
            projectId: 1
          }
        }
      }
    })
  })
})

// This request can only be fulfilled using AnyAuth
test('AnyAuth with multiple operations with different auth requirements in a link', () => {
  let query = `{ 
    viewerAnyAuth(exampleApiBasicProtocol: {username: "arlene123", password: "password123"}, exampleApiKeyProtocol: {apiKey: "abcdef"}) {
      project (projectId: 3) {
        projectId
        patentId
        patent {
          patentId
        }
        projectLead {
          name
        }
      }
    }
  }`
  return graphql(createdSchema, query, null, {}).then(result => {
    expect(result).toEqual({
      data: {
        viewerAnyAuth: {
          project: {
            projectId: 3,
            patentId: '100',
            patent: {
              patentId: '100'
            },
            projectLead: {
              name: 'William B Ropp'
            }
          }
        }
      }
    })
  })
})

test('Extract token from context', () => {
  let query = `{
    secure
  }`

  return openapiToGraphql
    .createGraphQlSchema(oas, {
      tokenJSONpath: '$.user.token',
      viewer: true
    })
    .then(({ schema }) => {
      return graphql(schema, query, null, { user: { token: 'abcdef' } }).then(
        result => {
          expect(result).toEqual({
            data: {
              secure: 'A secure message.'
            }
          })
        }
      )
    })
})
