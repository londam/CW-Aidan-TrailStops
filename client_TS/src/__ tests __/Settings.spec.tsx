import { render, fireEvent, screen } from '@testing-library/react';
import Settings from '../components/settings/settings';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

test('Checks the settingss page is displaying speed options', () => {
  const { getByText, getByRole } = render(
    <MemoryRouter>
      <Settings
        closeOverlay={jest.fn()}
        settingsData={{ distance: 'km', speed: 3 }}
        setSettingsData={jest.fn()}
        markers={{}}
        setMarkers={jest.fn()}
        setSettingsClicked={jest.fn()}
      />
    </MemoryRouter>
  );

  // Check that the current speed is showinbg
  expect(getByText('3Kmph - Regular')).toBeInTheDocument();

  const speedSelect = getByRole('combobox');
  fireEvent.mouseDown(speedSelect);
  const listbox = screen.getByRole('listbox');

  const speedOptions = screen.getAllByText('3Kmph - Regular');
  expect(speedOptions.length).toBeGreaterThan(1);

  expect(listbox).toContainElement(speedOptions[1]);

  // Check all the speed options
  expect(screen.getByText('2Kmph - Slow')).toBeInTheDocument();
  expect(screen.getByText('4Kmph - Fast')).toBeInTheDocument();
  expect(screen.getByText('5Kmph - Lightning')).toBeInTheDocument();
});
