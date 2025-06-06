# Landscape Background Components

A modular, clean architecture implementation of a stylized landscape background with layered hills, trees, and clouds.

## Architecture Overview

The landscape system is built with separation of concerns and reusability in mind:

```
landscape/
├── components/
│   ├── Cloud.tsx         # Renders individual clouds
│   ├── CloudLayer.tsx    # Manages cloud layers (far/mid/near)
│   ├── Hill.tsx          # Renders hill layers with trees
│   ├── Tree.tsx          # Renders different tree types
│   └── SVGDefs.tsx       # SVG gradients and filters
├── utils/
│   └── utils.ts          # Data generation and helper functions
├── constants.ts          # Configuration and color constants
├── types.ts              # TypeScript type definitions
├── index.ts              # Public API exports
└── README.md             # This file
```

## Key Design Principles

1. **Component Modularity**: Each visual element (cloud, tree, hill) is a separate component
2. **Type Safety**: Full TypeScript coverage with proper interfaces
3. **Performance**: Memoized data generation to prevent unnecessary re-renders
4. **Configurability**: All colors, sizes, and counts are centralized in constants
5. **Separation of Concerns**: Logic (utils), presentation (components), and configuration (constants) are separated

## Usage

```tsx
import { LandscapeBackground } from './components/roadmap/LandscapeBackground';

<LandscapeBackground width={1920} height={1080} />
```

## Component Details

### LandscapeBackground
Main container component that orchestrates all landscape elements.

### Cloud
Renders realistic clouds using multiple overlapping ellipses.

### Tree
Supports three tree types:
- Coniferous (triangular)
- Round (deciduous)
- Abstract (stylized)

### Hill
Renders smooth hill curves using quadratic bezier paths with positioned trees.

### CloudLayer
Groups clouds by depth layer (far/mid/near) with optional blur effects.

### SVGDefs
Contains all SVG gradient and filter definitions used throughout the landscape.

## Configuration

Edit `constants.ts` to customize:
- Color palette
- Layer configurations
- Cloud and tree distributions
- Dimensions

## Performance Notes

- Static data is generated once and memoized
- Internal coordinate system (3800x1000) ensures consistent scaling
- Blur filters are applied selectively for performance

## Color Scheme

The landscape uses a natural, earthy palette:
- Sky: Cream/beige tones (#fbf9ed, #f1ecd5, #e4e8da)
- Hills: Various green shades from light to dark
- Trees: Dark forest greens (#3c4637, #4d5938)
- Clouds: Subtle cream (#fbf9ed) 