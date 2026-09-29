import type { VehicleImage, VehicleImageSrcsetDto } from "../types/vehicle";
import { apiUrl } from "./api";
import { toImage } from "./vehicles";

/** GET /v2/car-images/{id}/: todas las fotos de un vehículo (el listado solo trae unas pocas). */
type CarImagesDto = {
  image_first?: string | null;
  image_first_srcset?: VehicleImageSrcsetDto[] | null;
  /** URLs firmadas, sin la principal. */
  images?: (string | null)[] | null;
  /** Un array de variantes por foto, en el mismo orden que `images`. */
  images_srcset?: VehicleImageSrcsetDto[][] | null;
};

/**
 * Todas las fotos de un vehículo, la principal primero. Se llama **desde el cliente**, solo
 * cuando alguien intenta pasar de foto en la tarjeta (`VehicleGalleryComponent`): pedirlas todas
 * de entrada sería una petición por tarjeta, y en el catálogo son 22 por página. Si falla
 * devuelve `[]` y la tarjeta se queda con las que ya tenía.
 */
export async function getVehicleImages(id: number): Promise<VehicleImage[]> {
  try {
    const response = await fetch(apiUrl(`/v2/car-images/${id}/`));
    if (!response.ok) return [];
    const dto: CarImagesDto = await response.json();

    const result: VehicleImage[] = [];
    const first = toImage(dto.image_first_srcset, dto.image_first);
    if (first) result.push(first);

    const urls = dto.images ?? [];
    const srcsets = dto.images_srcset ?? [];
    const count = Math.max(urls.length, srcsets.length);
    for (let i = 0; i < count; i++) {
      const image = toImage(srcsets[i], urls[i]);
      if (image) result.push(image);
    }
    return result;
  } catch {
    return [];
  }
}
