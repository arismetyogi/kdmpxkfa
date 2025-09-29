<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CooperationSubmission extends Model
{
    public static function generateSubmissionNumber(): string
    {
        $prefix = 'KDKMP';
        $date = now()->format('Ymd');
        $random = strtoupper(substr(uniqid(), -6));

        return "{$prefix}-{$date}-{$random}";
    }
}
