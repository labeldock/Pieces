
This is intended as a quick reference and showcase.

##### help me
This is not a complete sentence in English. 
Please help me to write English

### Table of Contents
  - [Concept](#concept)
  - [Important](#important)
  - [Image Extraction](#extraction)
  - [Retina-resolution extraction](#retina-extraction)
  - [Style template extraction](#style-template-extraction)
  - [Except extraction](#except-extraction)
  - [Helper extraction](#helper-extraction)
  - [Extraction with canvas size](#extraction-with-canvas-size)

<a name="concept"/>
## Concept #
This script is useful for developing web and mobile application layer extraction script.

<a name="important"/>
## Important #
Extract is only be from LayerSet image.

## Usage #

<a name="extraction"/>
### Extraction #
@,파일이름,확장자명을 입력하면 하위폴더로 이미지가 추출됩니다.

규칙
```
 @filename[png|jpeg|jpg|gif] => docname~/filename.[png|jpeg|jpg|gif]
```
```
	@filename.png => docname~/filename.png
	@filename.gif => docname~/filename.gif
	@filename.jpg => docname~/filename.jpg
	@filename     => docname~/filename.png
```

<a name="retina-extraction"/>
### 레티나 해상도 파일 추출  #
고해상도 이미지와 함께 저해상도를 추출하고자 할 때 사용가능합니다. 현재 png추출만 지원하고 있습니다.

규칙
```
 @filename@2x => docname~/regular/filename.png , docname~/retina/filename.png
```

<a name="style-template-extraction"/>
### 다수 레이어셋 스타일 적용  #
추후 설명 보강예정..
```
@some-01
@some-02
@some-03
$some-$
$some-$-active
$some-$-hover

(out)=>
@some-01.png,
@some-01-active.png,
@some-01-hover.png,
@some-02.png,
@some-02-active.png,
@some-02-hover.png,
@some-03.png,
@some-03-active.png,
@some-03-hover.png
```

<a name="except-extraction"/>
### 이미지추출 대상 제외  #
내부에 예제로 들어간 이미지 대상을 제거할 수 있습니다.

규칙
```
 {!@}
```

<a name="helper-extraction"/>
### 도움이미지 추출  #
규칙
```
 {help}filename       =>   docname~/help/filename.png
 {help}filename.jpeg  =>   docname~/help/filename.jpeg
```

<a name="extraction-with-canvas-size"/>
### 캔버스크기 지정  #
추출될 이미지의 고정크기를 지정할 수 있습니다. 옵션이 좀 더 있으나 초안에서는 생략됩니다.

규칙
```
 <10x10>filename     =>   docname~/filename.png (size 10x10)
 <10x>filename       =>   docname~/filename.png (size 10x10)
 <x10>filename       =>   docname~/filename.png (size 10x10)
```
