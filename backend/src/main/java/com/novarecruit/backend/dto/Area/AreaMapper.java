package com.novarecruit.backend.dto.Area;

import com.novarecruit.backend.entity.Area;
import org.springframework.stereotype.Component;

@Component
public class AreaMapper {

	public AreaResponse toResponse(Area area) {
		if (area == null) {
			return null;
		}

		return AreaResponse.builder()
				.id(area.getId())
				.nombre(area.getNombre())
				.descripcion(area.getDescripcion())
				.estado(area.getEstado())
				.fechaCreacion(area.getFechaCreacion())
				.build();
	}

	public Area toEntity(AreaRequest request) {
		if (request == null) {
			return null;
		}

		return Area.builder()
				.nombre(normalize(request.getNombre()))
				.descripcion(normalize(request.getDescripcion()))
				.estado(request.getEstado() == null || request.getEstado())
				.build();
	}

	public void updateEntity(Area area, AreaRequest request) {
		if (area == null || request == null) {
			return;
		}

		area.setNombre(normalize(request.getNombre()));
		area.setDescripcion(normalize(request.getDescripcion()));

		if (request.getEstado() != null) {
			area.setEstado(request.getEstado());
		}
	}

	private String normalize(String value) {
		if (value == null) {
			return null;
		}

		String normalizedValue = value.trim();
		return normalizedValue.isEmpty() ? null : normalizedValue;
	}

}
