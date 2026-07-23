# AI 生成圖片參考資料來源
## 人物圖像參考
### 原型來源
- RPG Maker 內建角色創作器產生人物原型
- 根據人物原型產生全身圖

### 人物表情包
- 由全身圖為母圖延伸出不同人物表情
- 部分表情參考網路/動畫/漫畫表情樣式，與母圖做融合

### 人物動作提示詞

均使用下列提示詞要求 AI 再根據生成的提示詞丟給 GPT or Grok 產生對應圖片

```
你現在是一名 ai prompt 工程師
你的職責是將需求翻譯成 GPT image 可以產生圖片的提示詞
我都會提供母圖、參考圖
母圖是人物長相、外觀、特色、衣裝、畫風的絕對權威
且不可以修改到沒有提及的部分
另外你也善於避免AI容易產生幻覺的提示詞
你的工作是讓母圖跟參考圖融合
例如：根據參考圖變換表情、姿勢等
```

```
絕對不要產圖片
我現在要先討論圖片編輯的需求
你現在是一名 ai prompt 工程師
你的職責是將需求翻譯成 grok image 可以產生圖片的提示詞
我都會提供母圖來做圖片編輯
有時候我也會提供參考圖要求你參考哪些內容
你善於避免AI容易產生幻覺的提示詞

我上傳了兩張圖片
第一張是我遊戲裡面的羅莎的頭貼，是母圖
第二張藍色頭髮的圖片是我的遊戲主角貓貓，是參考圖

參考圖是用來作為人物基礎畫風，包涵全身的服裝風格、色彩表現風格、畫風等的參考用途
母圖是我希望被編輯的圖片，他提供的是基本人物資訊，因此需要根據參考圖來去補上人物的半身圖
根據上述需求產生 prompt

補充資訊
羅莎設定為 21 歲，是冒險者公會的最強天才，知曉非常多知識，但卻有高敏感人格，很容易受他人情緒影響，除非是熟悉的人
```

嗷嗷表情差分
```
Edit this image.

Preserve the original character identity, hairstyle, fox ears, face shape, outfit, armor, accessories, pose, body proportions, composition, lighting, shading, watercolor rendering style, soft anime eyes, and all other visual details exactly as in the original image.



Do not change the clothing, pose, camera angle, hairstyle, body position, or illustration style.
Render only the upper body portrait. Do not render any body parts below the chest.
Use a pure white background.
Output in a 1:1 aspect ratio.
Limit the edit strictly to the face only.

Keep every non-facial element unchanged.
Do not reinterpret the character.
Maintain the exact original illustration.
Edit only the requested area.

Positive prompt

Negative prompt



Reference Isolation

The second image serves exclusively as a facial expression reference.

Treat every non-facial element in the second image as irrelevant.

Ignore all clothing, armor, hairstyle, ears, accessories, rendering style, lighting, colors, body proportions, composition, camera angle, and character design from the second image.

The first image is the only source of truth for the character design.

Only transfer the facial expression.
```

圖片生成後會經過反覆編輯、挑選、以及部分手動修改

## 封面圖像
### 主標題提示詞(Gemini)

<details>
Create a professional JRPG game logo.

Text:

負可敵國

Meaning:

a humorous fantasy adventure about overwhelming debt,
a parody of 「富可敵國」 transformed into 「負可敵國」,
wealth replaced by debt,
comedic yet epic fantasy atmosphere.

Design Style:

official JRPG title logo,
fantasy adventure game logo,
high-end Steam indie RPG logo,
light novel cover logo,
professional game branding.

Typography:

large bold Chinese calligraphy-inspired characters,
high readability,
strong silhouette,
dynamic fantasy typography,
custom logo design,
premium game title treatment.

Visual Theme:

debt,
gold coins,
adventure guild,
fantasy quest,
comedic misfortune,
wealth and debt contrast,
lighthearted fantasy world.

Color Scheme:

luxurious gold gradient,
bright metallic highlights,
deep navy blue outlines,
subtle magical glow,
small ruby and sapphire accents,
rich fantasy color palette.

Decorations:

gold coins integrated into the logo,
small cat paw motifs,
fantasy ornament details,
guild emblem elements,
ornamental scrollwork,
subtle crystal motifs,
adventure-themed embellishments.

Composition:

text only,
centered logo,
balanced design,
clean silhouette,
easy to read at small sizes,
suitable for Steam capsule artwork,
suitable for RPG title screen.

Background:

transparent background,
PNG,
no scenery,
no character,
logo only.

Quality:

masterpiece,
professional graphic design,
vector-like clarity,
sharp edges,
high contrast,
crisp typography,
official game logo quality,
transparent PNG

the character 「負」 is emphasized,
slightly larger than the other characters,
contains subtle crack patterns,
contains debt crystal motifs,
the focal point of the logo
</details>


### 副標題提示詞(Gemini)
<details>
Create a Japanese light novel style subtitle logo.

Text:

好不容易人化的我，必須得靠身體賺錢

Design Style:

Japanese light novel subtitle,
fantasy comedy adventure,
humorous fantasy story,
playful and charming,
secondary title for a JRPG logo.

Typography:

clean modern Chinese typography,
high readability,
slightly rounded font,
light novel cover style,
professional subtitle design,
elegant and refined,
less dominant than the main title.

Visual Mood:

comedic,
self-deprecating humor,
adventurer life,
part-time jobs,
debt repayment,
fantasy guild atmosphere,
cute but unfortunate protagonist.

Color Scheme:

white lettering,
soft cream highlights,
deep navy outline,
subtle gold accents,
minimal magical glow,
clean and readable.

Decorations:

small gold coin accents,
tiny cat paw prints,
small fantasy guild ornaments,
subtle crystal decorations,
minimal decorative elements.

Composition:

single line subtitle,
wide horizontal layout,
centered composition,
designed to sit beneath a main title logo,
high readability at small sizes,
clean silhouette.

Background:

transparent background,
PNG,
logo only,
no scenery,
no characters.

Quality:

professional game logo design,
light novel subtitle quality,
sharp typography,
crisp edges,
transparent PNG,
high resolution,
vector-like clarity.
</details>


