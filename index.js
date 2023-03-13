$(document).ready(function () {
  $("#form").on("submit", (e) => {
    e.preventDefault();

    $("#result").empty();

    const data = new FormData(e.target);
    const dataArray = [...data.entries()];
    const searchString = dataArray[0][1];

    if (searchString.length < 3) {
      $("#inputError").show();
      return;
    }

    const queryString = "q=" + encodeURIComponent(searchString);

    const url = `https://api.github.com/search/issues?${queryString}`;

    async function sendResponse() {
      try {
        const response = await fetch(url);
        const responseData = await response.json();

        const responseDataItems = responseData.items;

        if (responseDataItems == undefined) {
          const errorRequest = document.createElement("p");
          $(errorRequest).addClass("errorMessage");
          errorRequest.append(
            "Неверная строка запроса или нет доступа. Статус ошибки: " +
              response.status +
              "."
          );
          $("#result").append(errorRequest);
          return;
        }

        if (responseDataItems.length == 0) {
          const emptyList = document.createElement("p");
          $(emptyList).addClass("errorMessage");
          emptyList.append("Ничего не найдено.");
          $("#result").append(emptyList);
          return;
        }

        for (var i = 0; i < 10; i++) {
          const resultItem = document.createElement("p");
          $(resultItem).addClass("resultItem");

          const creator = document.createElement("p");
          creator.append("creator: " + responseDataItems[i].user.login);

          const url = responseDataItems[i].html_url;

          const link = $("<a href='" + url + "' target='_blank'></a>");
          const title = document.createElement("h3");
          $(title).addClass("title");
          title.append(responseDataItems[i].title);
          link.append(title);

          const date = document.createElement("p");
          date.append("date: " + responseDataItems[i].created_at.substr(0, 10));

          $(resultItem).append(creator);
          $(resultItem).append(link);
          $(resultItem).append(date);

          $("#result").append(resultItem);
        }
      } catch (error) {
        console.log("Request error: " + error);
      }
    }
    sendResponse();

    $("#inputError").hide();
  });

  $("#form").keypress(function (event) {
    if (event.key === "Enter") {
      event.preventDefault();

      $("#form").submit();
      return false;
    }
  });
});
