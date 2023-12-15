import { describe, it, expect } from 'vitest';
import Pyramid, { PyramidLayer } from '@/components/Pyramid';

describe('PyramidLayer', () => {
  it('should create a layer with correct size and default values', () => {
    const size = 3;
    const radius = 1;
    const totalLayers = 5;
    const layer = new PyramidLayer(size, radius, totalLayers);

    expect(layer.size).toBe(size);
    expect(layer.matrix.length).toBe(size);
    layer.matrix.forEach(row => {
      expect(row.length).toBe(size);
      row.forEach(cell => {
        expect(cell.color).toBe(0xFFD700); // Default color
        expect(cell.userData).toBeNull();
      });
    });
  });

  it('should correctly set a cell color', () => {
    const layer = new PyramidLayer(3, 1, 5);
    const testColor = 0x00FF00;
    layer.set(1, 1, testColor);

    expect(layer.get(1, 1).color).toBe(testColor);
  });

  // Additional tests can be added here
});

describe('Pyramid', () => {
  it('should initialize a pyramid with specified number of layers', () => {
    const layersNum = 5;
    const sphereRadius = 1;
    const pyramid = new Pyramid(layersNum, sphereRadius);

    expect(pyramid.n).toBe(layersNum);
    expect(pyramid.r).toBe(sphereRadius);
    expect(pyramid.layers.length).toBe(layersNum);
    pyramid.layers.forEach(layer => {
      expect(layer).toBeInstanceOf(PyramidLayer);
    });
  });

  it('should return the correct layer via getLayer()', () => {
    const pyramid = new Pyramid(5, 1);
    const layerIndex = 3;
    const layer = pyramid.getLayer(layerIndex);

    expect(layer).toBeInstanceOf(PyramidLayer);
    expect(layer.size).toBe(3);
  });

  it('should get the correct cell from a layer', () => {
    const pyramid = new Pyramid(5, 1);
    const layerIndex = 2;
    const x = 1, y = 1;
    const cell = pyramid.get(layerIndex, x, y);

    expect(cell).toBeDefined();
    expect(cell.color).toBe(0xFFD700); // Default color
  });
});
