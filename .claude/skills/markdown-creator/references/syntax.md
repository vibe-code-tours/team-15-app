# Markdown syntax reference

Quick lookup for constructs that are easy to get wrong. GitHub-Flavored
Markdown (GFM).

## Headings

```text
# H1
## H2
### H3
```

## Emphasis

```text
*italic*  or  _italic_
**bold**
***bold italic***
~~strikethrough~~
```

## Lists

```text
- item
- item
  - nested (two spaces)

1. first
1. second   <!-- renders as 2 -->
1. third
```

## Links and images

```text
[label](https://example.com)
[label](https://example.com "title")
<https://example.com>           <!-- autolink -->
![alt text](./diagram.png)

[ref]: https://example.com      <!-- reference style -->
See [the docs][ref].
```

## Code

````text
Inline: `value`

```js
const x = 1;
```
````

## Tables (GFM)

```text
| Name | Type   | Default |
|------|--------|---------|
| port | number | 3000    |
| host | string | 0.0.0.0 |
```

Alignment via colons in the divider row: `:---` left, `:---:` center,
`---:` right.

## Blockquotes

```text
> Quoted text.
>
> Second paragraph.
```

## Task lists (GFM)

```text
- [x] done
- [ ] not done
```

## Horizontal rule

```text
---
```

## Footnotes (GFM)

```text
Statement.[^1]

[^1]: The footnote text.
```

## Collapsible section (HTML, renders on GitHub)

```html
<details>
<summary>Click to expand</summary>

Hidden content.

</details>
```
