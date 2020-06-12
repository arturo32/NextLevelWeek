# NextLevelWeek - Ecoleta

Project developed for the Next Level Week event by <a href="https://rocketseat.com.br/">Rocketseat</a>.

##  Overview

<p align="center">
  <img src="https://github.com/arturo32/NextLevelWeek/blob/master/images/NLW-usage.gif">
</p>

This project it's about a site that allows you to register a recycling collection point, so people can find one more easily in their city. It is divided in two parts: the back-end, an restful API made with NodeJS, and the front-end, made with ReactJS.

## What I did differently  

### Map

<p align="center">
  <img src="https://github.com/arturo32/NextLevelWeek/blob/master/images/NLW-map.gif">
</p>

The original project have a map from the <a href="https://leafletjs.com/">Leaflet API</a> and selection boxes with <a href="https://servicodados.ibge.gov.br/api/docs/localidades?versao=1">IBGE API</a> data in them (city and states from Brazil). I have added one more, the <a href="https://nominatim.org/release-docs/develop/api/Overview/">Nominatim API</a>, that can give coordinates of an address and vice-versa. That way, from a click in the map, I can give the state, city and street of a point.

### Responsiveness

<p align="center">
  <img src="https://github.com/arturo32/NextLevelWeek/blob/master/images/NLW-responsiveness.gif">
</p>

The original site wasn't very responsive to different windows sizes. I fixed that with a bit of CSS, messing around with media queries and Flexbox properties.

