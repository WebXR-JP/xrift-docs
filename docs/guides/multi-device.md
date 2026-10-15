---
sidebar_position: 3
---

# 対応端末（PC・モバイル・VR）

XRift には PC・モバイル（スマートフォン・タブレット）・VR ヘッドセットから同じインスタンスに入れます。ワールドは**少なくとも PC とモバイルのどちらでも動作する**ように作ってください。VR もできる範囲で対応してください。

| 端末 | 対応 | 主な操作 |
|------|------|----------|
| PC | 必須（推奨） | マウス＋キーボード。画面中央のクロスヘアで狙ってクリック |
| モバイル | 必須（推奨） | タッチ。仮想ジョイスティックで移動 |
| VR | できる範囲で | コントローラー。レイで狙ってトリガー |

PC だけで動作確認をしていると、モバイルでは何も操作できない、VR では何も表示されない、というワールドになりがちです。よくある原因は次の2つです。

## 独自のキーボードショートカットに頼らない

モバイルと VR にはキーボードがありません。`window.addEventListener('keydown')` で作った機能は、PC 以外では一切使えません。また W / A / S / D・Space・Q / E・G・H・Esc などはプラットフォームの操作に使われているため、ワールドのショートカットと衝突します。

代わりに、端末を問わず同じ形で届く仕組みを使ってください。

- **ボタン・スイッチ類** は [`Interactable`](/world-components/components/#interactable) で作る。PC はクリック、モバイルはタッチ、VR はコントローラーで反応します
- **乗り物の操縦** は [`Seat` / `Vehicle`](/world-components/components/#seat) の `onControlInput` を使う。キーボード・仮想ジョイスティック・サムスティックの入力が同じ形で届きます
- **文字入力** は [`TextInput`](/world-components/components/#textinput)、**確認ダイアログ** は [`useConfirm`](/world-components/components/#useconfirm) を使う

ショートカットを足すこと自体は構いません。ただし、同じ操作を `Interactable` などからも行えるようにして、ショートカットは PC 向けの近道に留めてください。

:::caution[Grabbable は現在 PC のみ]
[`Grabbable`](/world-components/components/#grabbable) の掴む操作は、現在 PC（ポインターロック＋クロスヘア）でしか行えません。ワールドの進行に必要な操作を `Grabbable` だけに任せないでください。
:::

## HUD・UI は DOM ではなく 3D 空間に置く

独自の DOM（HTML 要素）で作った HUD には次の問題があります。

- **モバイルで崩れる**: 画面が狭く、縦横も切り替わります。プラットフォームの仮想ジョイスティックやボタンとも重なります
- **VR では表示されない**: VR 中は 3D シーンだけが描画されるため、DOM の要素は一切見えません

スコア・説明文・メニューなどの UI は、3D 空間内のオブジェクトとして置いてください。

- 文字は `@react-three/drei` の `Text`、パネルやメニューは `@react-three/uikit` で作る（どちらもホストと共有済み）
- 日本語を表示するときは [`useDefaultFont`](/world-components/components/#usedefaultfont) でフォントを読み込む
- 常にプレイヤーの方を向かせたいときは [`BillboardY`](/world-components/components/#billboardy) で囲む
- ボタンにするときは `Interactable` で囲む

## 公開前のチェックリスト

- [ ] キーボードがなくても、すべての機能にたどり着ける
- [ ] 画面に重ねる DOM の UI を置いていない
- [ ] 文字や UI が 3D 空間内にあり、スマートフォンの画面でも読める大きさになっている
- [ ] 進行に必要な操作を `Grabbable` だけに任せていない
- [ ] アップロード後、スマートフォンの実機で入室して操作できる
- [ ] （できれば）VR ヘッドセットで入室して、UI が見えて操作できる
