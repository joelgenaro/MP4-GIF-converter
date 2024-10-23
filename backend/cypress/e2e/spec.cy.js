describe("Load Test for /convert API", () => {
  it("should handle 100 requests per minute", () => {
    const requests = [];
    const filePath = "test.mp4";

    for (let i = 0; i < 100; i++) {
      requests.push(
        cy
          .fixture(filePath, "binary")
          .then(Cypress.Blob.binaryStringToBlob)
          .then((blob) => {
            const formData = new FormData();
            formData.append("video", blob, "test_video.mp4");

            return cy.request({
              method: "POST",
              url: "http://localhost:3000/convert",
              body: formData,
              headers: {
                "Content-Type": "multipart/form-data",
              },
              encoding: "binary",
            });
          })
      );
    }

    cy.wrap(Promise.all(requests)).then((responses) => {
      responses.forEach((response) => {
        expect(response.status).to.eq(200);
      });
    });
  });
});
