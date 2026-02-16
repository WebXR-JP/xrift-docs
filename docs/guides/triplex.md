---
sidebar_position: 3
---

# Triplex（ビジュアルエディタ）

[Triplex](https://triplex.dev/) は React Three Fiber 向けのビジュアルエディタで、VS Code 拡張として提供されています。コードを直接編集することなく、3D シーン内のコンポーネントの配置や調整をビジュアルに行うことができます。

![Triplex VS Code](/img/triplex-vscode.png)

## インストール

VS Code の拡張機能マーケットプレイスから「Triplex」を検索してインストールします。

1. VS Code を開く
2. 拡張機能パネル（`Cmd + Shift + X`）を開く
3. 「Triplex」で検索
4. 「Install」をクリック

## XRift プロジェクトでの使い方

XRift のワールドは React Three Fiber で構築されているため、Triplex をそのまま活用できます。

1. VS Code でワールドプロジェクトを開く
2. `.tsx` ファイルを開いた状態で、コマンドパレット（`Cmd + Shift + P`）から「Triplex: Open」を実行
3. ビジュアルエディタ上でコンポーネントの位置・回転・スケールを調整
4. 変更はソースコードに自動反映される

Triplex を使うことで、`position` や `rotation` の値を手動で調整する手間が省け、直感的にシーンを構築できます。

## 参考リンク

- [Triplex 公式サイト](https://triplex.dev/)
