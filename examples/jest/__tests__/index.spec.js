"use strict"

const { pactWith } = require("jest-pact")
const { Matchers } = require("@pact-foundation/pact")

const { getMeDogs, getMeCats } = require("../index")

pactWith(
  { consumer: "Jest Consumer Example", provider: "Jest Provider Example", spec: 3 },
  provider => {
    describe("Dogs API", () => {
      const DOGS_DATA = [
        {
          dog: 1,
        },
      ]

      const dogsSuccessResponse = {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
        body: DOGS_DATA,
      }

      const dogsListRequest = {
        uponReceiving: "a request for dogs",
        withRequest: {
          method: "GET",
          path: "/dogs",
          headers: {
            Accept: "application/json",
          },
        },
      }

      beforeEach(() => {
        const interaction = {
          state: "i have a list of dogs",
          ...dogsListRequest,
          willRespondWith: dogsSuccessResponse,
        }
        return provider.addInteraction(interaction)
      })

      // add expectations
      it("returns a successful body", () => {
        return getMeDogs({
          url: provider.mockService.baseUrl,
        }).then(dogs => {
          expect(dogs).toEqual(DOGS_DATA)
        })
      })
    })

    describe("Cats API", () => {
      const CATS_DATA = [{ cat: 2 }, { cat: 3 }]

      const catsSuccessResponse = {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
        body: CATS_DATA,
      }

      const catsListRequest = {
        uponReceiving: "a request for cats with given catId",
        withRequest: {
          method: "GET",
          path: "/cats",
          query: {
            "catId[]": Matchers.eachLike("1"),
          },
          headers: {
            Accept: "application/json",
          },
        },
      }

      beforeEach(() => {
        return provider.addInteraction({
          state: "i have a list of cats",
          ...catsListRequest,
          willRespondWith: catsSuccessResponse,
        })
      })

      it("returns a successful body", () => {
        return getMeCats({
          url: provider.mockService.baseUrl,
        }).then(cats => {
          expect(cats).toEqual(CATS_DATA)
        })
      })
    })
  }
)
