import { NextResponse } from 'next/server';
import { INITIAL_MEMBERS } from '@/lib/tree-layout';
import { FamilyMember } from '@/types/family';

// In-memory fallback store for development/demo
let membersStore: FamilyMember[] = [...INITIAL_MEMBERS];

export async function GET() {
  return NextResponse.json({
    success: true,
    data: membersStore,
    count: membersStore.length,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newMember: FamilyMember = {
      id: body.id || 'm_' + Math.random().toString(36).substring(2, 9),
      surname: body.surname || 'Li',
      givenName: body.givenName || 'Unnamed',
      gender: body.gender || 'male',
      birthDate: body.birthDate || '',
      deathDate: body.deathDate || '',
      isDeceased: body.isDeceased || false,
      photoUrl: body.photoUrl || '',
      notes: body.notes || '',
      fatherId: body.fatherId || undefined,
      motherId: body.motherId || undefined,
      spouseId: body.spouseId || undefined,
      generation: body.generation || 1,
      isVerified: body.isVerified !== undefined ? body.isVerified : true,
    };

    // Update relationship references if needed
    if (newMember.spouseId) {
      const spouse = membersStore.find((m) => m.id === newMember.spouseId);
      if (spouse) {
        spouse.spouseId = newMember.id;
      }
    }

    membersStore.push(newMember);

    return NextResponse.json({
      success: true,
      message: 'Family member created successfully',
      data: newMember,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to parse member payload' },
      { status: 400 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const index = membersStore.findIndex((m) => m.id === body.id);

    if (index === -1) {
      return NextResponse.json(
        { success: false, error: 'Member not found' },
        { status: 404 }
      );
    }

    membersStore[index] = { ...membersStore[index], ...body };

    return NextResponse.json({
      success: true,
      message: 'Member updated successfully',
      data: membersStore[index],
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update member' },
      { status: 400 }
    );
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { success: false, error: 'Member ID is required' },
      { status: 400 }
    );
  }

  membersStore = membersStore.filter((m) => m.id !== id);

  return NextResponse.json({
    success: true,
    message: 'Member deleted successfully',
  });
}
