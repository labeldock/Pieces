
This is intended as a quick reference and showcase.

### help me
```
	This is not a complete sentence in English. Please help me to write English
```
### Table of Contents
  - [Concept](#concept)
  - [Important](#important)
  - [SetupScript](#setup-script)
  - [Image Extraction](#extraction)
  - [Extract for Retina Resolution](#retina-extraction)
  - [Auto style execute](#auto-style-exeucte)
  - [Except extraction](#except-extraction)
  - [Helper extraction](#helper-extraction)
  - [Extraction with canvas size](#extraction-with-canvas-size)


<a name="concept"/>
## Concept #
This script is useful for developing web and mobile application layer extraction script.
Pieces는 다음으 목적을 위해 만들어졌습니다.
  - 빠른 프로토타입 페이지 개발
  - 겹쳐진 복수의 이미지를 깔끔하게 추출
  - 이미지 추출과 같은 단순반복작업 제거
  
  

<a name="important"/>
## Important #
Extract is only be from LayerSet image.


<a name="setup"/>
## Setup Script #
  pieces.jsx copy into Photoshop Scripts folder.
  - OSX
    - /Applications/Adobe Photoshop.../Presets/Scripts 
    - ![Insert in the name of LayerSet](/help-img/help-img-setup-1.png)
  - Windows
    - C:\Program Files\Adobe\Adobe Photoshop...\Presets\Scripts
    - C:\Program Files(x86)\Adobe\Adobe Photoshop...\Presets\Scripts


<a name="run"/>
## Run Script #
[Photoshop Menubar] File > Script > Pieces

![run-img](/help-img/help-img-setup-2.png)

```
	- Selected layerset (Extraction in selected layerset)
	- inspect size      (Inspect the selected layerset extraction size)
	- All               (Extraction all)
	- Close             (Exit run)
```
<a name="extraction"/>
### Extraction #
@,파일이름,확장자명을 입력하면 하위폴더로 이미지가 추출됩니다.


```
	#syntex
	@filename[png|jpeg|jpg|gif]
	
	#result
	@filename.png => docname~/filename.png
	@filename.gif => docname~/filename.gif
	@filename.jpg => docname~/filename.jpg
	@filename     => docname~/filename.png
```
![Insert in the name of LayerSet](/help-img/help-img-section-1.png)
![Extract result](/help-img/help-img-section-2.png)


<a name="retina-extraction"/>
### Extract for Retina Resolution  #
고해상도 이미지와 함께 저해상도를 추출하고자 할 때 사용가능합니다. 현재 png추출만 지원하고 있습니다.
```
	#syntex
	@filename@2x
	
	#result
    => docname~/regular/filename.png
    => docname~/retina/filename@2x.png
```
![retina-extraction-named](/help-img/help-img-section-3.png)
![retina-extraction-result](/help-img/help-img-section-4.png)


<a name="auto-style-exeucte"/>
### Auto style execute  #
```
	#syntex
	@some-01
		layer
	$some-$
		layer(default fx)
	$some-$-active
		layer(active fx)
	$some-$-hover
		layer(hover fx)
	
	#result
	@some-01.png (default fx image),
	@some-01-active.png (active fx image),
	@some-01-hover.png (hover fx image),
```
![auto-style-named](/help-img/help-img-section-5.png)
![auto-style-result](/help-img/help-img-section-6.png)
![auto-style-deatail](/help-img/help-img-section-7.png)


<a name="except-extraction"/>
### Except extraction  #
내부에 예제로 들어간 이미지 대상을 제거할 수 있습니다.

규칙
```
 {!@}
```

<a name="helper-extraction"/>
### Helper Extraction  #
규칙
```
 {help}filename       =>   docname~/help/filename.png
 {help}filename.jpeg  =>   docname~/help/filename.jpeg
```

<a name="extraction-with-canvas-size"/>
### Extraction with canvas size  #
추출될 이미지의 고정크기를 지정할 수 있습니다. 옵션이 좀 더 있으나 초안에서는 생략됩니다.

규칙
```
 <10x10>filename     =>   docname~/filename.png (size 10x10)
 <10x>filename       =>   docname~/filename.png (size 10x10)
 <x10>filename       =>   docname~/filename.png (size 10x10)
```
