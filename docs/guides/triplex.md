---
sidebar_position: 3
---

# Triplex（ビジュアルエディタ）

[Triplex](https://triplex.dev/) は React Three Fiber 向けのビジュアルエディタで、VS Code 拡張として提供されています。コードを直接編集することなく、3D シーン内のコンポーネントの配置や調整をビジュアルに行うことができます。

![Triplex VS Code](/img/triplex-vscode.png)

## インストール

[VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=trytriplex.triplex-vsce) からインストールします。

## XRift プロジェクトでの使い方

XRift のワールドは React Three Fiber で構築されているため、Triplex をそのまま活用できます。

1. VS Code でワールドプロジェクトを開く
2. エクスポートされたコンポーネントを含む `.tsx` ファイルを開く
3. コンポーネント上部に表示される「Open in Triplex」CodeLens をクリック
4. ビジュアルエディタ上でコンポーネントの位置・回転・スケールを調整
5. 変更はソースコードに自動反映される

Triplex を使うことで、`position` や `rotation` の値を手動で調整する手間が省け、直感的にシーンを構築できます。

## 参考リンク

- [Triplex 公式サイト](https://triplex.dev/)
