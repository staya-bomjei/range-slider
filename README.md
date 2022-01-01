# range-slider
Четвертое задание из обучающей программы MetaLamp.

## Описание проекта
Проект представляет из себя [JQuery](https://jquery.com/) плагин, реализующий функционал слайдера с ползунком.

Проект разделён на две части: **range-slider** плагин и **веб страница**, на которой показаны разные варианты использования плагина и панели, с помощью которых можно посмотреть как влияют на отображение слайдера его параметры.

## GitHub Pages
[**Demo Page**](https://staya-bomjei.github.io/range-slider)

## Развертывание

### Клонировать репозиторий:

```
  git clone https://github.com/staya-bomjei/range-slider.git
```

`npm install` - устанавливает все зависимости проекта

### Сборка проекта:

`npm run start` - запускает локальный сервер на порту **4200**, на котором будет собираться проект

`npm run dev` - собирает проект без минификации файлов в директорию `./dist`

`npm run prod` - собирает проект c минификацией файлов и оптимизацией импортов в директорию `./dist`

### Linting
`npm run stylelint` - запускает линтинг scss файлов по стандарту airbnb

`npm run eslint` - запускает линтинг ts файлов по стандарту airbnb

### Testing
`npm run test` - запускает все тесты и генерирует карту покрытия тестами

### GitHub Pages
`npm run deploy` - собирает проект в режиме production и пушит собранный проект в ветку gh-pages

## Архитектура плагина
Плагин построен на архитектуре [MVP Passive View](https://ru.wikipedia.org/wiki/Model-View-Presenter)
> TODO: Я только что понял что использовал MVP, но без Passive View, потому что в моей реализации View сам обрабатывает все события создаваемые Пользователем надо исправлять.

### Диаграмма
> TODO: Надо будет нарисовать диаграмму, когда вся работа будет закончена.

### Слои отвязывание слоёв плагина
> TODO: доделаю это, когда вся работа будет закончена.

### Проследим цепочку действий при обновлении модели
> TODO: Т.к. я напортачил с MVP сейчас моя цепочка не корректна

### Проследим цепочку действий при обновлении отображения
> TODO: Т.к. я напортачил с MVP сейчас моя цепочка не корректна

## Опции плагина
| Опция | Значение по умолчанию | Описание |
|-------|-----------------------|----------|
| **selector**: string | - | Селектор элементов, которые нужно сделать слайдерами, эта опция обязательна при инициализации |
| **min**: number | 0 | Минимальное значение слайдера, не может быть больше или равно **max** |
| **max**: number | 100 | Максимальное значение слайдера, не может быть меньше или равно **min** |
| **step**: number | 1 | Размер шага в слайдере, не может быть равен нулю |
| **strings**: string[] | - | Массив строк, которые будут использоваться вместо значений слайдера, а так же будут отображаться на его шкале, причём, если эта опция указана, то запрещено указывать эти опции: **min**, **max**, **step**; а также значение опции **scaleParts** должно быть меньше чем количество элементов **strings** |
| **valueFrom**: number | 50 | Значение первого ползунка, оно должно попадать в интервал [**min**, **max**], а так же разница (**valueFrom** - **min**) должна быть кратна **step**, за исключением случая, когда **valueFrom** равно **max** |
| **valueTo**: number | - | Значение второго ползунка, оно должно попадать в интервал [**min**, **max**], а так же разница (**valueTo** - **min**) должна быть кратна **step**, за исключением случая, когда **valueTo** равно **max** |
| **isRange**: boolean | **false** | Если **true** - то у слайдера будет два ползунка, иначе - только один. Количество ползунков влияет на положение шкалы прогрессе, с одним ползунком шкала будет растягиваться от начала трека до ползунка, с двумя оно будет растягиваться от левого ползунка до правого |
| **orientation**: 'vertical' \| 'horizontal' | 'horizontal' | Положение слайдера |
| **showScale**: boolean | **true** | Видимость шкалы, если **true** - то шкалу видно, иначе - не видно |
| **scaleParts**: number | 4 | Количество частей у шкалы слайдера, причём количество частей не может быть больше, чем количество валидных значений в интервале [**min**, **max**]. Если указана опция **strings**, то значение должно быть меньше чем количество элементов **strings** |
| **showTooltip**: boolean | **true** | Видимость подсказок над ползунками, если **true** - то их видно всегда, иначе их не видно, эта опция не может быть указана как **true** вместе с **showTooltipAfterDrag** равным **true** |
| **showTooltipAfterDrag**: boolean | **false** | Если **true** - то подсказки над ползунками будет видно **только** во время перетаскивания ползунков, иначе действуют правила **showTooltip** |
| **showProgress**: boolean | **true** | Видимость шкалы прогресса, если **true** - то её видно, иначе - не видно |
| **allowThumbsSwap**: boolean | **false** | Возможность менять ползунки местами, если **true** то ползунки можно перетягивать друг за друга. Нельзя указывать, если **isRange** **false**  |

## Установка плагина
Чтобы использовать этот плагин нужны два файла `range-slider.js` и `range-slider.css`, взять их можно из ветки gh-pages, они лежат в директории `js/plugins/range-slider/`. Или можно клонировать этот репозиторий и, установив все зависимости и самостоятельно собрав проект, можно взять нужные файлы в директории `dist/js/plugins/range-slider/`.

Теперь, прежде чем начать пользоваться плагином вам нужно подключить JQuery любым удобным способом, а затем файлы плагина.
> TODO: Я пока не знаю, могу ли я создать свой npm пакет, поэтому установить этот плагин можно только способом выше.

## Использование плагина
> TODO: займусь этой частью, когда вся остальная работа будет выполнена.

## Node Version
**v16.13.1**

## Зависимости
В данном проекте нет зависимостей, за исключением [JQuery](https://jquery.com/), который подключается на демонстрационной странице с помощью CDN.